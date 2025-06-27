import { dbConnect } from '@/server/db';
import StudentProgress from '@/server/progress/model';
import Lesson from '@/server/lessons/model';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const { studentId } = req.query;

    console.log('API /progress/student:', {
      method: req.method,
      studentId
    });

    if (!studentId) {
      console.error('Missing studentId');
      return res.status(400).json({ error: 'studentId is required' });
    }

    if (req.method === 'GET') {
      const studentObjectId = new Types.ObjectId(studentId as string);
      
      console.log('API: Fetching progress for student:', studentId);
      
      // Получаем все уроки
      const lessons = await Lesson.find({}).sort({ orderNumber: 1 });
      const lessonIds = lessons.map(l => l._id.toString());
      console.log('API: Found lessons:', lessons.length, 'lesson IDs:', lessonIds);
      
      // Удаляем старые записи прогресса с lessonId: null
      const deletedCount = await StudentProgress.deleteMany({ 
        studentId: studentObjectId,
        lessonId: null 
      });
      if (deletedCount.deletedCount > 0) {
        console.log('API: Deleted', deletedCount.deletedCount, 'old progress records with null lessonId');
      }
      
      // Получаем прогресс с валидным lessonId
      let progresses = await StudentProgress.find({ 
        studentId: studentObjectId,
        lessonId: { $ne: null }
      }).populate('lessonId', 'title orderNumber description');

      // Если нет ни одной валидной записи — создаём для всех уроков
      if (!progresses || progresses.length === 0) {
        console.log('API: No valid progress records found, creating default ones for', lessons.length, 'lessons');
        const defaultProgresses = lessons.map(lesson => ({
          studentId: studentObjectId,
          lessonId: lesson._id,
          attended: false,
          status: 'not_started'
        }));
        if (defaultProgresses.length > 0) {
          await StudentProgress.insertMany(defaultProgresses);
          progresses = await StudentProgress.find({ 
            studentId: studentObjectId,
            lessonId: { $ne: null }
          }).populate('lessonId', 'title orderNumber description');
          console.log('API: Created', progresses.length, 'default progress records');
        }
      }
      
      // Фильтруем только те, у которых есть lessonId
      const validProgresses = progresses.filter(progress => progress.lessonId);
      
      console.log('API: Valid progresses (with lessonId):', validProgresses.length);
      
      const response = validProgresses.map(progress => ({
        _id: progress._id,
        lessonId: progress.lessonId,
        attended: progress.attended,
        attendanceDate: progress.attendanceDate,
        attendanceConfirmedBy: progress.attendanceConfirmedBy,
        scheduledDate: progress.scheduledDate,
        completedAt: progress.completedAt,
        lessonLink: progress.lessonLink,
        homework: progress.homework,
        status: progress.status
      }));
      
      console.log('API: Returning response with', response.length, 'valid records');
      console.log('API: Response details:', response.map(r => ({
        lessonId: r.lessonId,
        attended: r.attended,
        attendanceDate: r.attendanceDate
      })));
      
      return res.json(response);
    }

    console.error('Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      method: req.method,
      query: req.query
    });
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
} 