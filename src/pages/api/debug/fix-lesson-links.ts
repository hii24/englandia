import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Получаем все уроки
    const lessons = await Lesson.find({});
    
    let updatedCount = 0;
    const results = [];
    
    for (const lesson of lessons) {
      const lessonObj = lesson.toObject ? lesson.toObject() : lesson;
      const currentLessonLink = lessonObj.lessonLink;
      
      // Проверяем, есть ли title и url в lessonLink
      if (!currentLessonLink || !currentLessonLink.title || !currentLessonLink.url) {
        // Обновляем урок, добавляя недостающие поля
        const updatedLesson = await Lesson.findByIdAndUpdate(
          lessonObj._id,
          {
            lessonLink: {
              title: currentLessonLink?.title || 'Ссылка на занятие',
              url: currentLessonLink?.url || 'https://zoom.us/',
              forStudent: currentLessonLink?.forStudent !== false
            }
          },
          { new: true }
        );
        
        results.push({
          lessonId: lessonObj._id,
          orderNumber: lessonObj.orderNumber,
          title: lessonObj.title,
          oldLessonLink: currentLessonLink,
          newLessonLink: updatedLesson.lessonLink,
          updated: true
        });
        
        updatedCount++;
      } else {
        results.push({
          lessonId: lessonObj._id,
          orderNumber: lessonObj.orderNumber,
          title: lessonObj.title,
          lessonLink: currentLessonLink,
          updated: false
        });
      }
    }

    return res.status(200).json({
      success: true,
      totalLessons: lessons.length,
      updatedLessons: updatedCount,
      results: results
    });
  } catch (error: any) {
    console.error('Fix lesson links error:', error);
    return res.status(500).json({ error: error.message });
  }
} 