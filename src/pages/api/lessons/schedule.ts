import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { lessonId, scheduledDate, scheduleEnabled, schedulePattern } = req.body;
    
    if (!lessonId) {
      return res.status(400).json({ error: 'lessonId is required' });
    }

    try {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      if (scheduledDate !== undefined) lesson.scheduledDate = scheduledDate;
      if (scheduleEnabled !== undefined) lesson.scheduleEnabled = scheduleEnabled;
      if (schedulePattern) lesson.schedulePattern = schedulePattern;

      await lesson.save();
      return res.json({ success: true, lesson });
    } catch (error) {
      console.error('Error updating lesson schedule:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    const { lessonId } = req.query;
    
    if (!lessonId) {
      return res.status(400).json({ error: 'lessonId is required' });
    }

    try {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      return res.json({
        scheduledDate: lesson.scheduledDate,
        scheduleEnabled: lesson.scheduleEnabled,
        schedulePattern: lesson.schedulePattern
      });
    } catch (error) {
      console.error('Error getting lesson schedule:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
} 