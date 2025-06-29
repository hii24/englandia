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
    
    const { firstName, lastName, email, role = 'guest' } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        error: 'firstName, lastName, and email are required' 
      });
    }

    // Проверяем, что пользователь с таким email не существует
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists',
        user: {
          _id: existingUser._id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          role: existingUser.role
        }
      });
    }

    console.log('👤 Creating test user:', {
      firstName,
      lastName,
      email,
      role
    });

    // Создаем тестового пользователя
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone: '+7 (999) 123-45-67',
      age: 25,
      comment: 'Тестовый пользователь',
      password: 'test123', // В реальном проекте нужно хешировать
      role,
      isEmailVerified: true
    });

    console.log('✅ Test user created:', {
      userId: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role
    });

    return res.status(200).json({
      success: true,
      message: 'Test user created successfully',
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('❌ Error creating test user:', error);
    return res.status(500).json({ 
      error: 'Failed to create test user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 