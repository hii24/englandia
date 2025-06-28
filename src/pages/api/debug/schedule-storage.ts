import type { NextApiRequest, NextApiResponse } from 'next';
import { getStorageStatus, clearStorage } from '@/server/schedule-storage';
import { dbConnect } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const status = await getStorageStatus();
      
      return res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        storage: status
      });
      
    } catch (error: any) {
      console.error('❌ Schedule storage debug error:', error);
      return res.status(500).json({ 
        error: 'Failed to get storage status', 
        details: error.message 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await clearStorage();
      
      return res.status(200).json({
        success: true,
        message: 'Storage cleared successfully',
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('❌ Schedule storage clear error:', error);
      return res.status(500).json({ 
        error: 'Failed to clear storage', 
        details: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
} 