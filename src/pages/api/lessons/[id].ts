import type { NextApiRequest, NextApiResponse } from 'next';
import { getLessonById, updateLesson, archiveLesson } from '@/server/lessons/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    const lesson = await getLessonById(id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    return res.status(200).json(lesson);
  }
  if (req.method === 'PUT') {
    try {
      const updated = await updateLesson(id, req.body);
      return res.status(200).json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
  if (req.method === 'DELETE') {
    try {
      const archived = await archiveLesson(id);
      return res.status(200).json(archived);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
} 