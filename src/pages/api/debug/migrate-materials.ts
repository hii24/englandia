import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('🔄 Starting materials migration...');
    
    const db = await getDb();
    
    // Получаем ID админа
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    
    if (!adminUser) {
      return res.status(400).json({ error: 'Admin user not found' });
    }
    
    const adminId = adminUser._id.toString();
    console.log(`👤 Found admin user: ${adminId}`);
    
    // Получаем все уроки
    const lessons = await db.collection('lessons').find({}).toArray();
    let updatedCount = 0;
    
    for (const lesson of lessons) {
      let needsUpdate = false;
      let updateData: any = {};
      
      // Проверяем материалы
      if (lesson.materials && lesson.materials.length > 0) {
        const updatedMaterials = lesson.materials.map((material: any) => {
          if (!material.createdBy || material.createdBy === 'admin') {
            needsUpdate = true;
            return { ...material, createdBy: adminId };
          }
          return material;
        });
        if (needsUpdate) {
          updateData.materials = updatedMaterials;
        }
      }
      
      // Проверяем дополнительные материалы
      if (lesson.additionalMaterials && lesson.additionalMaterials.length > 0) {
        const updatedAdditionalMaterials = lesson.additionalMaterials.map((material: any) => {
          if (!material.createdBy || material.createdBy === 'admin') {
            needsUpdate = true;
            return { ...material, createdBy: adminId };
          }
          return material;
        });
        if (needsUpdate) {
          updateData.additionalMaterials = updatedAdditionalMaterials;
        }
      }
      
      // Проверяем домашние задания
      if (lesson.homework && lesson.homework.length > 0) {
        const updatedHomework = lesson.homework.map((material: any) => {
          if (!material.createdBy || material.createdBy === 'admin') {
            needsUpdate = true;
            return { ...material, createdBy: adminId };
          }
          return material;
        });
        if (needsUpdate) {
          updateData.homework = updatedHomework;
        }
      }
      
      if (needsUpdate) {
        await db.collection('lessons').updateOne(
          { _id: lesson._id },
          { $set: updateData }
        );
        updatedCount++;
        console.log(`✅ Updated lesson ${lesson._id}`);
      }
    }
    
    console.log(`🎉 Migration completed! Updated ${updatedCount} lessons`);
    
    return res.status(200).json({ 
      success: true, 
      message: `Migration completed! Updated ${updatedCount} lessons`,
      updatedCount,
      adminId
    });
    
  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return res.status(500).json({ 
      error: 'Migration failed', 
      details: error.message 
    });
  }
} 