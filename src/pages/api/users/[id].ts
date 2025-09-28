import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, dbConnect } from '@/server/db';
import { ObjectId } from 'mongodb';
import { isAdmin } from '@/server/auth/utils';
import { TeacherScheduleModel, LessonScheduleModel } from '@/server/schedule-storage';

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

      // Проверяем, что пользователь существует и это учитель
      const teacher = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      if (teacher.role !== 'teacher') {
        return res.status(400).json({ error: 'User is not a teacher' });
      }

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
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.status(405).json({ error: 'Method Not Allowed' });
} 