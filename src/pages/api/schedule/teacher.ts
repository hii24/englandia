import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  findTeacherSchedule, 
  saveTeacherSchedule, 
  type TeacherSchedule, 
  type DaySchedule,
  getStorageStatus
} from '@/server/schedule-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const { teacherId, studentId } = req.query;
    if (!teacherId || !studentId) {
      return res.status(400).json({ error: 'teacherId and studentId are required' });
    }
    const schedule = await findTeacherSchedule(teacherId as string, studentId as string);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    return res.json(schedule);
  }

  if (req.method === 'POST') {
    const { teacherId, studentId, enabled, daysSchedule, timezone } = req.body;
    if (!teacherId || !studentId || !daysSchedule || !timezone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const schedule = {
      teacherId,
      studentId,
      enabled,
      daysSchedule,
      timezone,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await saveTeacherSchedule(schedule);
    return res.json({ success: true, schedule });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 