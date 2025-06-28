import type { NextApiRequest, NextApiResponse } from 'next';
import { getStorageStatus, clearStorage } from '@/server/schedule-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API /debug/schedule-storage:', {
      method: req.method,
      query: req.query,
      body: req.body
    });

    if (req.method === 'GET') {
      // Получаем статус хранилища
      const status = getStorageStatus();
      
      return res.json({
        success: true,
        status,
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body;
      
      if (action === 'clear') {
        clearStorage();
        return res.json({
          success: true,
          message: 'Storage cleared successfully'
        });
      }
      
      return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
} 