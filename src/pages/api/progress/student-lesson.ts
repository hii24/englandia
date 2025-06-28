import { dbConnect } from '@/server/db';
import StudentProgress from '@/server/progress/model';
import Lesson from '@/server/lessons/model';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAndSendSubscriptionEmail } from '@/server/registration/subscription-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let studentId: string | undefined;
  let lessonId: string | undefined;
  
  try {
    await dbConnect();
    const queryData = req.method === 'GET' ? req.query : req.body;
    studentId = queryData.studentId as string;
    lessonId = queryData.lessonId as string;

    console.log('API /progress/student-lesson:', {
      method: req.method,
      studentId,
      lessonId,
      body: req.body
    });

    if (!studentId || !lessonId) {
      console.error('Missing required fields:', { studentId, lessonId });
      return res.status(400).json({ error: 'studentId and lessonId are required' });
    }

    // Конвертируем строковые ID в ObjectId
    const studentObjectId = new Types.ObjectId(studentId as string);
    const lessonObjectId = new Types.ObjectId(lessonId as string);

    if (req.method === 'GET') {
      const progress = await StudentProgress.findOne({ 
        studentId: studentObjectId, 
        lessonId: lessonObjectId 
      });
      if (!progress) {
        console.log('Progress not found for:', { studentId, lessonId });
        return res.status(404).json({ error: 'Not found' });
      }
      
      const response = { 
        lessonLink: progress.lessonLink, 
        homework: progress.homework,
        attended: progress.attended,
        attendanceDate: progress.attendanceDate,
        attendanceConfirmedBy: progress.attendanceConfirmedBy,
        scheduledDate: progress.scheduledDate,
        status: progress.status
      };
      
      console.log('GET response:', response);
      return res.json(response);
    }

    if (req.method === 'PUT') {
      const { lessonLink, homework, attended, attendanceDate, attendanceConfirmedBy, scheduledDate, status } = req.body;
      
      console.log('PUT request data:', {
        studentId,
        lessonId,
        lessonLink: !!lessonLink,
        homework: !!homework,
        attended,
        attendanceDate,
        attendanceConfirmedBy,
        scheduledDate,
        status
      });

      let progress = await StudentProgress.findOne({ 
        studentId: studentObjectId, 
        lessonId: lessonObjectId 
      });
      const isNew = !progress;
      
      if (!progress) {
        console.log('Creating new progress record for:', { studentId, lessonId });
        progress = new StudentProgress({ 
          studentId: studentObjectId, 
          lessonId: lessonObjectId 
        });
      } else {
        console.log('Found existing progress:', {
          attended: progress.attended,
          attendanceDate: progress.attendanceDate,
          status: progress.status,
          hasLessonLink: !!progress.lessonLink,
          hasHomework: !!progress.homework
        });
      }

      // Сохраняем предыдущее состояние для проверки изменений
      const wasAttended = progress.attended;
      const wasCompleted = progress.status === 'completed';

      // Обновляем поля только если они переданы (включая null, но не undefined)
      if (lessonLink !== undefined) {
        console.log('Updating lessonLink:', lessonLink);
        progress.lessonLink = lessonLink;
      }
      if (homework !== undefined) {
        console.log('Updating homework:', homework);
        progress.homework = homework;
      }
      if (attended !== undefined) {
        console.log('Updating attended:', attended);
        progress.attended = attended;
      }
      if (attendanceDate !== undefined) {
        console.log('Updating attendanceDate:', attendanceDate);
        progress.attendanceDate = attendanceDate;
      }
      if (attendanceConfirmedBy !== undefined) {
        console.log('Updating attendanceConfirmedBy:', attendanceConfirmedBy);
        if (attendanceConfirmedBy) {
          progress.attendanceConfirmedBy = new Types.ObjectId(attendanceConfirmedBy as string);
        } else {
          progress.attendanceConfirmedBy = undefined;
        }
      }
      if (scheduledDate !== undefined) {
        console.log('Updating scheduledDate:', scheduledDate);
        progress.scheduledDate = scheduledDate;
      }
      if (status !== undefined) {
        console.log('Updating status:', status);
        progress.status = status;
        // Если урок помечен как завершенный, устанавливаем дату завершения
        if (status === 'completed' && !wasCompleted) {
          progress.completedAt = new Date();
        }
      }
      
      console.log('Saving progress with data:', {
        attended: progress.attended,
        attendanceDate: progress.attendanceDate,
        attendanceConfirmedBy: progress.attendanceConfirmedBy,
        status: progress.status,
        completedAt: progress.completedAt,
        hasLessonLink: !!progress.lessonLink,
        hasHomework: !!progress.homework
      });
      
      // Если урок завершен и это первый урок, отправляем email
      if (attended && !wasAttended) {
        console.log('First lesson completed, ready to send email');
        await checkAndSendSubscriptionEmail(studentId, lessonId);
      }
      
      await progress.save();
      console.log('Progress saved successfully');
      return res.json({ success: true, isNew });
    }

    console.error('Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      method: req.method,
      studentId,
      lessonId,
      body: req.body
    });
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
} 