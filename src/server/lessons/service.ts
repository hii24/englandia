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
  const db = await getDb();
  const result = await db.collection('lessons').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result?.value || null;
}

export async function archiveLesson(id: string) {
  return updateLesson(id, { isArchived: true });
} 