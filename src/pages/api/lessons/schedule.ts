import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  findLessonSchedule, 
  saveLessonSchedule, 
  findLessonSchedulesByStudent,
  type LessonSchedule 
} from '@/server/schedule-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { lessonId, studentId, teacherId } = req.query;

  if (!lessonId || !studentId || !teacherId) {
    return res.status(400).json({ error: 'lessonId, studentId and teacherId are required' });
  }

  // Проверяем, что studentId и teacherId являются валидными MongoDB ObjectId
  const isValidObjectId = (id: string) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Для studentId и teacherId проверяем валидность ObjectId
  if (studentId !== 'default' && !isValidObjectId(studentId as string)) {
    return res.status(400).json({ error: 'Invalid studentId format' });
  }

  if (teacherId !== 'default' && !isValidObjectId(teacherId as string)) {
    return res.status(400).json({ error: 'Invalid teacherId format' });
  }

  // Проверяем, что учитель существует и имеет правильную роль (только если teacherId не 'default')
  if (teacherId !== 'default') {
    const teacher = await findUserById(teacherId as string);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ error: 'Unauthorized: Teacher not found' });
    }
  }

  // Проверяем, что студент существует (только если studentId не 'default')
  if (studentId !== 'default') {
    const student = await findUserById(studentId as string);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
  }

  if (req.method === 'GET') {
    const schedule = await findLessonSchedule(lessonId as string, studentId as string, teacherId as string);
    if (!schedule) {
      return res.json({
        enabled: false,
        scheduledDate: null,
        time: null,
        timezone: 'Europe/Moscow'
      });
    }
    return res.json({
      enabled: schedule.enabled,
      scheduledDate: schedule.scheduledDate,
      time: schedule.time,
      timezone: schedule.timezone
    });
  }

  if (req.method === 'POST') {
    const { enabled, scheduledDate, time, timezone } = req.body;
    const scheduleData = {
      lessonId: lessonId as string,
      studentId: studentId as string,
      teacherId: teacherId as string,
      scheduledDate: scheduledDate || null,
      time: time || null,
      timezone: timezone || 'Europe/Moscow',
      enabled: enabled || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await saveLessonSchedule(scheduleData);
    return res.json({
      success: true,
      schedule: {
        enabled: scheduleData.enabled,
        scheduledDate: scheduleData.scheduledDate,
        time: scheduleData.time,
        timezone: scheduleData.timezone
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 