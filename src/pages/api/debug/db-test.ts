import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing database connection...');
    
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    
    console.log('Database connection successful');
    console.log('Available collections:', collections.map(c => c.name));
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 