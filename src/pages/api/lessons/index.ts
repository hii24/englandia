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
      
      // Отладочная информация о домашних заданиях и играх
      lessons.forEach((lesson: any) => {
        console.log(`🔍 API: Lesson ${lesson.orderNumber} "${lesson.title}":`, {
          hasHomework: !!lesson.homework,
          homeworkLength: lesson.homework ? lesson.homework.length : 0,
          homeworkItems: lesson.homework ? lesson.homework.map((hw: any) => hw.title || hw.url) : [],
          hasGames: !!lesson.games,
          gamesLength: lesson.games ? lesson.games.length : 0,
          gamesItems: lesson.games ? lesson.games.map((game: any) => game.title) : [],
          bunnyVideoId: lesson.bunnyVideoId,
          // Добавляем отладку для lessonLink
          hasLessonLink: !!lesson.lessonLink,
          lessonLink: lesson.lessonLink,
          lessonLinkTitle: lesson.lessonLink?.title,
          lessonLinkUrl: lesson.lessonLink?.url,
          lessonLinkForStudent: lesson.lessonLink?.forStudent,
          // Проверяем все поля урока
          allFields: Object.keys(lesson.toObject ? lesson.toObject() : lesson)
        });
      });
      
      return res.status(200).json(lessons);
    }

    if (req.method === 'POST') {
      // TODO: Проверка роли (admin)
      try {
        console.log('🔍 API lessons/index.ts: Начинаем создание урока');
        console.log('🔍 API lessons/index.ts: Полное тело запроса:', JSON.stringify(req.body, null, 2));
        console.log('🔍 API lessons/index.ts: bunnyVideoId в запросе:', req.body.bunnyVideoId);
        console.log('🔍 API lessons/index.ts: games в запросе:', req.body.games);
        console.log('🔍 API lessons/index.ts: games.length:', req.body.games?.length);
        console.log('🔍 API lessons/index.ts: games[0]:', req.body.games?.[0]);
        
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
        
        console.log('🔍 API lessons/index.ts: Данные для сохранения:', JSON.stringify(lessonData, null, 2));
        console.log('🔍 API lessons/index.ts: games для сохранения:', lessonData.games);
        console.log('🔍 API lessons/index.ts: games.length для сохранения:', lessonData.games?.length);
        
        const lesson = new Lesson({
          ...lessonData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log('🔍 API lessons/index.ts: Модель урока перед сохранением:', {
          title: lesson.title,
          bunnyVideoId: lesson.bunnyVideoId,
          games: lesson.games,
          gamesLength: lesson.games?.length
        });
        
        // Проверяем схему модели
        console.log('🔍 API lessons/index.ts: Схема модели Lesson:', Lesson.schema.paths);
        console.log('🔍 API lessons/index.ts: Есть ли поле games в схеме:', 'games' in Lesson.schema.paths);
        
        await lesson.save();
        console.log('🔍 API lessons/index.ts: Урок успешно сохранен');
        console.log('🔍 API lessons/index.ts: Сохраненный урок:', {
          id: lesson._id,
          bunnyVideoId: lesson.bunnyVideoId,
          games: lesson.games,
          gamesLength: lesson.games?.length,
          title: lesson.title
        });
        
        // Проверяем, что урок действительно сохранился с играми
        const savedLesson = await Lesson.findById(lesson._id);
        console.log('🔍 API lessons/index.ts: Проверка сохраненного урока из БД:', {
          id: savedLesson._id,
          title: savedLesson.title,
          games: savedLesson.games,
          gamesLength: savedLesson.games?.length
        });
        
        // Явно указываем поля для ответа
        const responseData = {
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          orderNumber: lesson.orderNumber,
          videoUrl: lesson.videoUrl,
          bunnyVideoId: lesson.bunnyVideoId,
          games: lesson.games || [],
          materials: lesson.materials || [],
          additionalMaterials: lesson.additionalMaterials || [],
          homework: lesson.homework || [],
          lessonLink: lesson.lessonLink,
          isActive: lesson.isActive,
          isArchived: lesson.isArchived,
          teacherId: lesson.teacherId,
          scheduledDate: lesson.scheduledDate,
          scheduleEnabled: lesson.scheduleEnabled,
          schedulePattern: lesson.schedulePattern,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
          __v: lesson.__v
        };
        
        console.log('🔍 API lessons/index.ts: Отправляем ответ:', responseData);
        
        return res.status(201).json(responseData);
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