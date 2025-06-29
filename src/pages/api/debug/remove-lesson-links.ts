import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Удаляем поле lessonLink из всех уроков
    const result = await Lesson.updateMany(
      {}, // все документы
      { $unset: { lessonLink: 1 } } // удаляем поле lessonLink
    );
    
    // Получаем обновленные уроки для проверки
    const lessons = await Lesson.find({}).select('_id title orderNumber lessonLink');
    
    return res.status(200).json({
      success: true,
      message: 'lessonLink field removed from all lessons',
      updateResult: result,
      lessonsAfterUpdate: lessons.map(lesson => ({
        _id: lesson._id,
        title: lesson.title,
        orderNumber: lesson.orderNumber,
        hasLessonLink: !!lesson.lessonLink
      }))
    });
  } catch (error: any) {
    console.error('Remove lesson links error:', error);
    return res.status(500).json({ error: error.message });
  }
} 