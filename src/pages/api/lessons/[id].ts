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
      console.log('🔒 API: PUT запрос на обновление урока:', {
        lessonId: id,
        body: req.body,
        headers: req.headers
      });
      console.log('🔍 bunnyVideoId в запросе обновления:', req.body.bunnyVideoId);

      const lesson = await Lesson.findById(id);
      if (!lesson) {
        console.log('❌ API: Урок не найден:', id);
        return res.status(404).json({ error: 'Lesson not found' });
      }

      console.log('🔒 API: Найден урок:', {
        lessonId: lesson._id,
        title: lesson.title,
        currentBunnyVideoId: lesson.bunnyVideoId,
        currentIsLocked: lesson.isLocked
      });

      // Обновляем только разрешенные поля
      const allowedFields = ['title', 'description', 'videoUrl', 'bunnyVideoId', 'materials', 'additionalMaterials', 'homework', 'lessonLink', 'isActive', 'isArchived', 'isLocked'];
      const updateData: any = {};
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
          console.log(`🔒 API: Обновляем поле ${field}:`, req.body[field]);
        }
      });

      // Добавляем информацию о том, кто заблокировал/разблокировал урок
      if (req.body.isLocked !== undefined) {
        console.log(`🔒 API: Lesson ${id} ${req.body.isLocked ? 'LOCKED' : 'UNLOCKED'} by teacher`);
      }

      updateData.updatedAt = new Date();
      
      console.log('🔒 API: Данные для обновления:', updateData);
      
      const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, { new: true });
      
      console.log('🔒 API: Урок обновлен:', {
        lessonId: updatedLesson._id,
        title: updatedLesson.title,
        newBunnyVideoId: updatedLesson.bunnyVideoId,
        newIsLocked: updatedLesson.isLocked
      });
      
      return res.status(200).json(updatedLesson);
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