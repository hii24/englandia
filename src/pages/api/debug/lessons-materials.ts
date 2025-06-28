import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Lesson from '@/server/lessons/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    
    console.log('🔍 Fetching lessons with materials...');
    
    // Получаем все уроки
    const lessons = await Lesson.find({}).select('_id title orderNumber materials additionalMaterials homework');
    
    console.log(`✅ Found ${lessons.length} lessons`);
    
    return res.status(200).json({ 
      success: true, 
      lessons: lessons,
      count: lessons.length
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching lessons:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch lessons', 
      details: error.message 
    });
  }
} 