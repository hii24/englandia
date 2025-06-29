import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const user = await findUserById(userId as string);
    
    if (!user) {
      return res.json({ 
        exists: false, 
        userId: userId,
        message: 'User not found' 
      });
    }

    return res.json({
      exists: true,
      userId: userId,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Database error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 