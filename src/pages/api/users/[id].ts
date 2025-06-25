import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/server/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'PATCH') {
    try {
      const db = await getDb();
      const { teacherId } = req.body;
      await db.collection('users').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { teacherId: teacherId || null } }
      );
      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.status(405).json({ error: 'Method Not Allowed' });
} 