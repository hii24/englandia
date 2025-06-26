import { dbConnect } from '@/server/db';
import StudentProgress from '@/server/progress/model';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { studentId, lessonId } = req.method === 'GET' ? req.query : req.body;

  if (!studentId || !lessonId) {
    return res.status(400).json({ error: 'studentId and lessonId are required' });
  }

  if (req.method === 'GET') {
    const progress = await StudentProgress.findOne({ studentId, lessonId });
    if (!progress) return res.status(404).json({ error: 'Not found' });
    return res.json({ lessonLink: progress.lessonLink, homework: progress.homework });
  }

  if (req.method === 'PUT') {
    const { lessonLink, homework } = req.body;
    let progress = await StudentProgress.findOne({ studentId, lessonId });
    if (!progress) {
      progress = new StudentProgress({ studentId, lessonId });
    }
    if (lessonLink) progress.lessonLink = lessonLink;
    if (homework) progress.homework = homework;
    await progress.save();
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
} 