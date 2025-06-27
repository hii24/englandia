import { ObjectId } from 'mongodb';
import { getDb } from '../db';

export async function getLessons() {
  const db = await getDb();
  return db.collection('lessons').find({ isArchived: { $ne: true } }).sort({ orderNumber: 1 }).toArray();
}

export async function getLessonById(id: string) {
  const db = await getDb();
  return db.collection('lessons').findOne({ _id: new ObjectId(id), isArchived: { $ne: true } });
}

export async function createLesson(data: any) {
  const db = await getDb();
  const now = new Date();
  const lesson = {
    ...data,
    isActive: true,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection('lessons').insertOne(lesson);
  return { ...lesson, _id: result.insertedId };
}

export async function updateLesson(id: string, updates: any) {
  try {
    const db = await getDb();
    console.log('Updating lesson:', { id, updates });
    
    // Проверяем, что урок существует
    const existingLesson = await db.collection('lessons').findOne({ _id: new ObjectId(id) });
    if (!existingLesson) {
      throw new Error(`Урок с ID ${id} не найден`);
    }
    
    console.log('Existing lesson:', existingLesson);
    
    // Сначала обновляем документ
    const updateResult = await db.collection('lessons').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    
    console.log('Update result:', updateResult);
    
    if (updateResult.matchedCount === 0) {
      throw new Error('Урок не найден');
    }
    
    if (updateResult.modifiedCount === 0) {
      console.log('No changes made to lesson');
    }
    
    // Затем получаем обновленный документ
    const updatedLesson = await db.collection('lessons').findOne({ _id: new ObjectId(id) });
    console.log('Updated lesson:', updatedLesson);
    
    return updatedLesson;
  } catch (error) {
    console.error('Error in updateLesson:', error);
    throw error;
  }
}

export async function archiveLesson(id: string) {
  return updateLesson(id, { isArchived: true });
} 