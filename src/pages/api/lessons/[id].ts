import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';
import { Types } from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Lesson ID is required' });
    }

    if (req.method === 'GET') {
      const lesson = await Lesson.findById(id);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      return res.status(200).json(lesson);
    }

    if (req.method === 'PUT') {
      try {
        console.log('🔍 API lessons/[id].ts: Начинаем обновление урока');
        console.log('🔍 API lessons/[id].ts: ID урока:', id);
        console.log('🔍 API lessons/[id].ts: Полное тело запроса:', JSON.stringify(req.body, null, 2));
        console.log('🔍 API lessons/[id].ts: games в запросе:', req.body.games);
        console.log('🔍 API lessons/[id].ts: games.length:', req.body.games?.length);
        
        // Обновляем только разрешенные поля
        const allowedFields = ['title', 'description', 'videoUrl', 'bunnyVideoId', 'games', 'materials', 'additionalMaterials', 'homework', 'lessonLink', 'isActive', 'isArchived', 'isLocked'];
        const updateData: any = {};
        
        allowedFields.forEach(field => {
          if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
          }
        });
        
        console.log('🔍 API lessons/[id].ts: Данные для обновления:', JSON.stringify(updateData, null, 2));
        console.log('🔍 API lessons/[id].ts: games для обновления:', updateData.games);
        
        const updatedLesson = await Lesson.findByIdAndUpdate(
          id,
          { ...updateData, updatedAt: new Date() },
          { new: true }
        );
        
        if (!updatedLesson) {
          return res.status(404).json({ error: 'Lesson not found' });
        }
        
        console.log('🔍 API lessons/[id].ts: Урок успешно обновлен');
        console.log('🔍 API lessons/[id].ts: Обновленный урок:', {
          id: updatedLesson._id,
          title: updatedLesson.title,
          bunnyVideoId: updatedLesson.bunnyVideoId,
          games: updatedLesson.games,
          gamesLength: updatedLesson.games?.length
        });
        
        return res.status(200).json(updatedLesson);
      } catch (e: any) {
        console.error('API /lessons/[id] error:', e);
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
      }
    }

    if (req.method === 'DELETE') {
      const lesson = await Lesson.findById(id);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      
      await Lesson.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Lesson deleted successfully' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error('API /lessons/[id] error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
} 