import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import Lesson from '@/server/lessons/model';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  findTeacherSchedule,
  saveLessonSchedule,
  saveTeacherSchedule,
  getStorageStatus,
  type TeacherSchedule
} from '@/server/schedule-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { studentId, teacherId } = req.query;

  if (!studentId || !teacherId) {
    return res.status(400).json({ error: 'studentId and teacherId are required' });
  }

  if (req.method === 'POST') {
    const { startDate, lessonsCount } = req.body;

    // Получаем расписание учителя из MongoDB
    let teacherSchedule = await findTeacherSchedule(teacherId as string, studentId as string) as TeacherSchedule | null;

    // Если расписание не найдено, создаем дефолтное
    if (!teacherSchedule) {
      const defaultSchedule: TeacherSchedule = {
        teacherId: teacherId as string,
        studentId: studentId as string,
        enabled: true,
        daysSchedule: [
          { day: 'monday', time: '18:00', enabled: true },
          { day: 'tuesday', time: '18:00', enabled: false },
          { day: 'wednesday', time: '18:00', enabled: true },
          { day: 'thursday', time: '18:00', enabled: false },
          { day: 'friday', time: '18:00', enabled: false },
          { day: 'saturday', time: '10:00', enabled: false },
          { day: 'sunday', time: '10:00', enabled: false }
        ],
        timezone: 'Europe/Moscow',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await saveTeacherSchedule(defaultSchedule);
      teacherSchedule = defaultSchedule;
    }

    if (!teacherSchedule || !teacherSchedule.enabled) {
      return res.status(400).json({
        error: 'Teacher schedule is not enabled',
        details: {
          scheduleExists: !!teacherSchedule,
          scheduleEnabled: teacherSchedule?.enabled || false,
          scheduleData: teacherSchedule
        }
      });
    }

    // Получаем все уроки
    const lessons = await Lesson.find({ isActive: true }).sort({ orderNumber: 1 });
    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ error: 'No active lessons found' });
    }

    // Получаем активные дни недели
    const enabledDays = teacherSchedule.daysSchedule.filter((day: any) => day.enabled);
    if (enabledDays.length === 0) {
      return res.status(400).json({ error: 'No enabled days in teacher schedule' });
    }

    // Функция для получения следующей даты занятия
    const getNextLessonDate = (currentDate: Date, dayOfWeek: string): Date => {
      const dayMap: Record<string, number> = {
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6,
        'sunday': 0
      };
      const targetDay = dayMap[dayOfWeek];
      const currentDay = currentDate.getDay();
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) {
        daysToAdd += 7;
      }
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + daysToAdd);
      return nextDate;
    };

    // Генерируем даты для уроков
    const scheduledLessons: any[] = [];
    let currentDate = startDate ? new Date(startDate) : new Date();
    let dayIndex = 0;
    let lessonIndex = 0;

    // Используем lessonsCount если указан, иначе все доступные уроки
    const maxLessons = lessonsCount ? Math.min(lessonsCount, lessons.length) : lessons.length;

    while (lessonIndex < maxLessons) {
      const daySchedule = enabledDays[dayIndex % enabledDays.length];
      const lessonDate = getNextLessonDate(currentDate, daySchedule.day);
      const [hours, minutes] = daySchedule.time.split(':');
      lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const lessonSchedule = {
        lessonId: lessons[lessonIndex]._id.toString(),
        studentId: studentId as string,
        teacherId: teacherId as string,
        scheduledDate: lessonDate.toISOString(),
        time: daySchedule.time,
        timezone: teacherSchedule.timezone,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await saveLessonSchedule(lessonSchedule);
      scheduledLessons.push(lessonSchedule);
      currentDate = new Date(lessonDate);
      currentDate.setDate(lessonDate.getDate() + 1);
      dayIndex++;
      lessonIndex++;
    }

    return res.json({
      success: true,
      scheduledLessons: scheduledLessons.map(ls => ({
        lessonId: ls.lessonId,
        scheduledDate: ls.scheduledDate,
        time: ls.time,
        timezone: ls.timezone
      })),
      totalLessons: lessons.length,
      scheduledCount: scheduledLessons.length
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 