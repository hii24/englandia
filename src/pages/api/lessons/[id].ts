import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const { id } = req.query;
    if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

    if (req.method === 'GET') {
      const lesson = await Lesson.findById(id);
      if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
      return res.status(200).json(lesson);
    }
    
    if (req.method === 'PUT') {
      try {
        console.log('PUT /api/lessons/[id]:', { id, body: req.body });
        
        // Получаем текущий урок для сравнения материалов
        const currentLesson = await Lesson.findById(id);
        if (!currentLesson) return res.status(404).json({ error: 'Lesson not found' });
        
        // Получаем ID пользователя из заголовка или тела запроса
        const userId = req.headers['x-user-id'] || req.body.userId;
        
        // Обрабатываем материалы, добавляя createdBy к новым
        let updatedBody = { ...req.body };
        if (req.body.materials) {
          updatedBody.materials = req.body.materials.map((material: any, index: number) => {
            // Если у материала нет createdBy, значит это новый материал
            if (!material.createdBy) {
              return { ...material, createdBy: userId };
            }
            return material;
          });
        }
        
        const updated = await Lesson.findByIdAndUpdate(
          id, 
          { ...updatedBody, updatedAt: new Date() },
          { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Lesson not found' });
        console.log('PUT /api/lessons/[id] result:', updated);
        return res.status(200).json(updated);
      } catch (e: any) {
        console.error('PUT /api/lessons/[id] error:', e);
        return res.status(400).json({ error: e.message });
      }
    }
    
    if (req.method === 'DELETE') {
      try {
        const archived = await Lesson.findByIdAndUpdate(
          id,
          { isArchived: true, updatedAt: new Date() },
          { new: true }
        );
        if (!archived) return res.status(404).json({ error: 'Lesson not found' });
        return res.status(200).json(archived);
      } catch (e: any) {
        console.error('DELETE /api/lessons/[id] error:', e);
        return res.status(400).json({ error: e.message });
      }
    }
    
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error('API /lessons/[id] error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
} 