import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const { role, teacherId } = req.query;
      const filter: any = {};
      if (role) {
        // Поддержка role=student,guest или role=student
        const roles = String(role).split(',');
        if (roles.includes('student')) {
          filter.role = { $in: ['student', 'guest'] };
        } else if (roles.length > 1) {
          filter.role = { $in: roles };
        } else {
          filter.role = role;
        }
      }
      if (teacherId) filter.teacherId = teacherId;
      const users = await db.collection('users').find(filter).toArray();
      return res.status(200).json(users);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.status(405).json({ error: 'Method Not Allowed' });
} 