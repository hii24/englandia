import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import { Schema, model, Types, models } from 'mongoose';

// Модель пользователя
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  age: Number,
  comment: String,
  password: String,
  role: { type: String, enum: ['admin', 'teacher', 'student', 'guest'], default: 'guest' },
  isEmailVerified: { type: Boolean, default: false },
  subscription: { type: Types.ObjectId, ref: 'Subscription' },
  teacherId: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Получаем всех пользователей
    const users = await User.find({}, {
      firstName: 1,
      lastName: 1,
      email: 1,
      role: 1,
      createdAt: 1,
      updatedAt: 1
    }).sort({ createdAt: -1 });

    console.log('📊 Получен список пользователей:', users.length);

    return res.status(200).json({
      success: true,
      users: users
    });

  } catch (error) {
    console.error('❌ Ошибка получения пользователей:', error);
    return res.status(500).json({ 
      error: 'Failed to get users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 