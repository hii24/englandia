import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await getDb();
    
    console.log('🔍 Fetching users...');
    
    // Получаем всех пользователей
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`✅ Found ${users.length} users`);
    
    return res.status(200).json({ 
      success: true, 
      users: users,
      count: users.length
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching users:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch users', 
      details: error.message 
    });
  }
} 