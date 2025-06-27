import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing database connection...');
    await dbConnect();
    console.log('Database connected successfully');
    
    // Проверяем количество уроков
    const lessonCount = await Lesson.countDocuments();
    console.log('Lesson count:', lessonCount);
    
    // Получаем один урок для теста
    const testLesson = await Lesson.findOne();
    console.log('Test lesson:', testLesson);
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      lessonCount,
      testLesson: testLesson ? {
        id: testLesson._id,
        title: testLesson.title,
        orderNumber: testLesson.orderNumber
      } : null
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
} 