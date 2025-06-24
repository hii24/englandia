import type { NextApiRequest, NextApiResponse } from 'next';
import { handleRegistration } from '@/server/registration/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const result = await handleRegistration(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (e: any) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ error: e.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 