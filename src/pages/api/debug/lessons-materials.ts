import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Получаем все уроки
    const lessons = await Lesson.find({}).sort({ orderNumber: 1 });
    
    // Подробная информация о каждом уроке
    const lessonsInfo = lessons.map((lesson: any) => {
      const lessonObj = lesson.toObject ? lesson.toObject() : lesson;
      return {
        _id: lessonObj._id,
        orderNumber: lessonObj.orderNumber,
        title: lessonObj.title,
        // Проверяем lessonLink
        hasLessonLink: !!lessonObj.lessonLink,
        lessonLink: lessonObj.lessonLink,
        lessonLinkTitle: lessonObj.lessonLink?.title,
        lessonLinkUrl: lessonObj.lessonLink?.url,
        lessonLinkForStudent: lessonObj.lessonLink?.forStudent,
        // Проверяем другие поля
        hasMaterials: !!lessonObj.materials,
        materialsLength: lessonObj.materials ? lessonObj.materials.length : 0,
        hasHomework: !!lessonObj.homework,
        homeworkLength: lessonObj.homework ? lessonObj.homework.length : 0,
        hasGames: !!lessonObj.games,
        gamesLength: lessonObj.games ? lessonObj.games.length : 0,
        // Все поля урока
        allFields: Object.keys(lessonObj),
        // Полный объект урока
        fullLesson: lessonObj
      };
    });

    return res.status(200).json({
      totalLessons: lessons.length,
      lessons: lessonsInfo,
      summary: {
        lessonsWithLessonLink: lessonsInfo.filter(l => l.hasLessonLink).length,
        lessonsWithMaterials: lessonsInfo.filter(l => l.hasMaterials).length,
        lessonsWithHomework: lessonsInfo.filter(l => l.hasHomework).length,
        lessonsWithGames: lessonsInfo.filter(l => l.hasGames).length
      }
    });
  } catch (error: any) {
    console.error('Debug lessons error:', error);
    return res.status(500).json({ error: error.message });
  }
} 