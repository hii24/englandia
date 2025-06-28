import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import Lesson from '@/server/lessons/model';
import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  findTeacherSchedule, 
  saveLessonSchedule, 
  type TeacherSchedule, 
  type DaySchedule,
  type LessonSchedule,
  saveTeacherSchedule,
  getStorageStatus
} from '@/server/schedule-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    
    const { studentId, teacherId } = req.query;
    
    console.log('API /lessons/auto-schedule:', {
      method: req.method,
      studentId,
      teacherId,
      body: req.body
    });

    if (!studentId || !teacherId) {
      return res.status(400).json({ error: 'studentId and teacherId are required' });
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

    if (req.method === 'POST') {
      const { startDate, lessonsCount = 4 } = req.body;
      
      console.log('POST auto-schedule data:', {
        studentId,
        teacherId,
        startDate,
        lessonsCount
      });

      // Получаем расписание учителя из общего модуля
      let teacherSchedule = findTeacherSchedule(teacherId as string, studentId as string);

      console.log('🔍 Auto-schedule: Found teacher schedule:', teacherSchedule);
      console.log('🔍 Auto-schedule: Schedule enabled:', teacherSchedule?.enabled);
      console.log('🔍 Auto-schedule: Schedule days:', teacherSchedule?.daysSchedule);
      console.log('🔍 Auto-schedule: Storage status:', getStorageStatus());

      // Если расписание не найдено, создаем дефолтное
      if (!teacherSchedule) {
        console.log('⚠️ Auto-schedule: No teacher schedule found, creating default schedule');
        
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
        
        saveTeacherSchedule(defaultSchedule);
        teacherSchedule = defaultSchedule;
        
        console.log('✅ Auto-schedule: Default schedule created:', teacherSchedule);
      }

      if (!teacherSchedule.enabled) {
        console.log('❌ Auto-schedule: Schedule exists but not enabled');
        
        return res.status(400).json({ 
          error: 'Teacher schedule is not enabled',
          details: {
            scheduleExists: true,
            scheduleEnabled: false,
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
      const enabledDays = teacherSchedule.daysSchedule.filter((day: DaySchedule) => day.enabled);
      
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
          daysToAdd += 7; // Переходим на следующую неделю
        }
        
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + daysToAdd);
        return nextDate;
      };

      // Генерируем даты для уроков
      const scheduledLessons: LessonSchedule[] = [];
      let currentDate = startDate ? new Date(startDate) : new Date();
      let dayIndex = 0;
      let lessonIndex = 0;

      while (lessonIndex < Math.min(lessonsCount, lessons.length)) {
        const daySchedule = enabledDays[dayIndex % enabledDays.length];
        const lessonDate = getNextLessonDate(currentDate, daySchedule.day);
        
        // Устанавливаем время занятия
        const [hours, minutes] = daySchedule.time.split(':');
        lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const lessonSchedule: LessonSchedule = {
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

        scheduledLessons.push(lessonSchedule);

        // Переходим к следующему дню
        currentDate = new Date(lessonDate);
        currentDate.setDate(lessonDate.getDate() + 1);
        dayIndex++;
        lessonIndex++;
      }

      // Сохраняем расписание уроков используя общий модуль
      for (const lessonSchedule of scheduledLessons) {
        saveLessonSchedule(lessonSchedule);
      }

      console.log('Auto-schedule completed:', scheduledLessons);
      
      return res.json({ 
        success: true, 
        scheduledLessons: scheduledLessons.map(ls => ({
          lessonId: ls.lessonId,
          scheduledDate: ls.scheduledDate,
          time: ls.time,
          timezone: ls.timezone
        }))
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
} 