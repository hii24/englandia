import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, dbConnect } from '@/server/db';
import { ObjectId } from 'mongodb';
import { isAdmin } from '@/server/auth/utils';
import { TeacherScheduleModel, LessonScheduleModel } from '@/server/schedule-storage';
import StudentProgress from '@/server/progress/model';
import Subscription from '@/server/subscription/model';
import { stripe } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'PATCH') {
    try {
      const db = await getDb();
      const { teacherId } = req.body;
      await db.collection('users').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { teacherId: teacherId || null } }
      );
      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  
  if (req.method === 'DELETE') {
    try {
      if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid id format' });
      }

      // Проверка прав администратора
      if (!isAdmin(req)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const db = await getDb();

      // Проверяем существование пользователя
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ветка удаления учителя (существующая логика сохранена)
      if (user.role === 'teacher') {
        // Обнуляем ссылки teacherId у учеников/гостей, назначенных этому учителю
        const unassignResult = await db.collection('users').updateMany(
          { teacherId: new ObjectId(id) },
          { $set: { teacherId: null } }
        );

        // Чистим расписания, связанные с учителем (mongoose коллекции)
        await dbConnect();
        const [tsDelete, lsDelete] = await Promise.all([
          TeacherScheduleModel.deleteMany({ teacherId: id }),
          LessonScheduleModel.deleteMany({ teacherId: id })
        ]);

        // Удаляем самого учителя
        const deleteResult = await db.collection('users').deleteOne({ _id: new ObjectId(id), role: 'teacher' });
        if (deleteResult.deletedCount === 0) {
          return res.status(500).json({ error: 'Failed to delete teacher' });
        }

        return res.status(200).json({
          success: true,
          unassignedStudents: unassignResult.modifiedCount || 0,
          removedTeacherSchedules: tsDelete.deletedCount || 0,
          removedLessonSchedules: lsDelete.deletedCount || 0,
        });
      }

      // Ветка удаления студента или гостя
      if (user.role === 'student' || user.role === 'guest') {
        await dbConnect();

        // 1) Подписка: отмена в Stripe (если есть) и удаление записи подписки
        let subscriptionCancelled = false;
        let subscriptionDeleted = false;
        try {
          if (user.subscription) {
            const sub = await Subscription.findById(user.subscription);
            if (sub) {
              if (sub.stripeSubscriptionId) {
                try {
                  // Отмена в конце оплаченного периода — безопасный сценарий при удалении
                  await stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: true } as any);
                  subscriptionCancelled = true;
                } catch (stripeErr) {
                  // Логируем и продолжаем
                  console.error('Stripe cancellation failed:', stripeErr);
                }
              }
              await Subscription.deleteOne({ _id: sub._id });
              subscriptionDeleted = true;
            }
          }
        } catch (e) {
          console.error('Subscription cleanup error:', e);
        }

        // 2) Прогресс студента
        const progressDelete = await StudentProgress.deleteMany({ studentId: new ObjectId(id) });

        // 3) Расписания по студенту (mongoose коллекции)
        const [tsByStudentDelete, lsByStudentDelete] = await Promise.all([
          TeacherScheduleModel.deleteMany({ studentId: id }),
          LessonScheduleModel.deleteMany({ studentId: id })
        ]);

        // 4) Удаляем пользователя
        const deleteUserResult = await db.collection('users').deleteOne({ _id: new ObjectId(id), role: { $in: ['student', 'guest'] } });
        if (deleteUserResult.deletedCount === 0) {
          return res.status(500).json({ error: 'Failed to delete user' });
        }

        return res.status(200).json({
          success: true,
          subscriptionCancelled,
          subscriptionDeleted,
          removedStudentProgress: progressDelete.deletedCount || 0,
          removedTeacherSchedulesByStudent: tsByStudentDelete.deletedCount || 0,
          removedLessonSchedulesByStudent: lsByStudentDelete.deletedCount || 0,
        });
      }

      // Прочие роли пока не поддерживаем
      return res.status(400).json({ error: 'Unsupported role for deletion' });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.status(405).json({ error: 'Method Not Allowed' });
} 