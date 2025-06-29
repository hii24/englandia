import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ 
        error: 'userId and newRole are required' 
      });
    }

    if (!['admin', 'teacher', 'student', 'guest'].includes(newRole)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be one of: admin, teacher, student, guest' 
      });
    }

    console.log('🔄 Изменяем роль пользователя:', {
      userId,
      newRole
    });

    // Получаем текущего пользователя
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oldRole = currentUser.role;

    // Обновляем роль пользователя
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: newRole,
        updatedAt: new Date()
      },
      { new: true }
    );

    console.log('✅ Роль пользователя изменена:', {
      userId,
      oldRole,
      newRole,
      userEmail: updatedUser?.email
    });

    return res.status(200).json({
      success: true,
      message: `User role changed from ${oldRole} to ${newRole}`,
      user: {
        _id: updatedUser?._id,
        firstName: updatedUser?.firstName,
        lastName: updatedUser?.lastName,
        email: updatedUser?.email,
        role: updatedUser?.role,
        oldRole: oldRole
      }
    });

  } catch (error) {
    console.error('❌ Ошибка изменения роли пользователя:', error);
    return res.status(500).json({ 
      error: 'Failed to change user role',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 