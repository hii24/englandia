import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';
// import { getSession } from 'next-auth/react'; // если используешь next-auth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    
    // const session = await getSession({ req });
    // const user = session?.user;
    // if (!user) return res.status(401).json({ error: 'Not authenticated' });

    if (req.method === 'GET') {
      const lessons = await Lesson.find({ isArchived: { $ne: true } }).sort({ orderNumber: 1 });
      console.log('API /lessons: Found', lessons.length, 'lessons');
      
      // Отладочная информация о домашних заданиях
      lessons.forEach((lesson: any) => {
        console.log(`🔍 API: Lesson ${lesson.orderNumber} "${lesson.title}":`, {
          hasHomework: !!lesson.homework,
          homeworkLength: lesson.homework ? lesson.homework.length : 0,
          homeworkItems: lesson.homework ? lesson.homework.map((hw: any) => hw.title || hw.url) : []
        });
      });
      
      return res.status(200).json(lessons);
    }

    if (req.method === 'POST') {
      // TODO: Проверка роли (admin)
      try {
        console.log('Creating lesson with data:', req.body);
        
        // Получаем ID пользователя из заголовка или тела запроса
        const userId = req.headers['x-user-id'] || req.body.userId;
        
        // Обрабатываем материалы, добавляя createdBy к новым
        let lessonData = { ...req.body };
        if (req.body.materials) {
          lessonData.materials = req.body.materials.map((material: any) => ({
            ...material,
            createdBy: userId
          }));
        }
        
        const lesson = new Lesson({
          ...lessonData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await lesson.save();
        console.log('Lesson created successfully:', lesson._id);
        return res.status(201).json(lesson);
      } catch (e: any) {
        console.error('Error creating lesson:', e);
        return res.status(400).json({ error: e.message });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error('API /lessons error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
} 