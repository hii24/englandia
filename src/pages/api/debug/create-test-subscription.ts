import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import Subscription from '@/server/subscription/model';
import { Schema, model, Types, models } from 'mongoose';

// Модель пользователя для обновления
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
    
    const { userId, subscriptionType = 'basic' } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        error: 'userId is required' 
      });
    }

    // Проверяем, что тип подписки валидный
    if (!['basic', 'intensive'].includes(subscriptionType)) {
      return res.status(400).json({ 
        error: 'subscriptionType must be "basic" or "intensive"' 
      });
    }

    console.log('🎭 Creating test subscription for user:', {
      userId,
      subscriptionType
    });

    // Получаем пользователя
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('👤 Found user:', {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });

    // Создаем тестовую подписку
    const subscriptionData = {
      userId: user._id,
      type: subscriptionType,
      status: 'active',
      startDate: new Date(),
      autoRenewal: true,
      lessonsPerMonth: subscriptionType === 'basic' ? 4 : 8,
      stripeSubscriptionId: `test_sub_${Date.now()}`,
      stripeCustomerId: `test_cust_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newSubscription = await Subscription.create(subscriptionData);
    console.log('💾 Test subscription created:', {
      subscriptionId: newSubscription._id,
      type: newSubscription.type,
      lessonsPerMonth: newSubscription.lessonsPerMonth
    });

    // Обновляем роль пользователя на 'student' если он был 'guest'
    let roleUpdate = {};
    if (user.role === 'guest') {
      roleUpdate = { role: 'student' };
    }

    // Обновляем поле subscription в модели пользователя
    const updateResult = await User.findByIdAndUpdate(userId, {
      subscription: newSubscription._id,
      ...roleUpdate,
      updatedAt: new Date()
    }, { new: true });

    console.log('✅ User updated:', {
      userId,
      subscriptionId: newSubscription._id,
      newRole: updateResult?.role,
      oldRole: user.role
    });

    return res.status(200).json({
      success: true,
      message: 'Test subscription created successfully',
      subscription: {
        _id: newSubscription._id,
        type: newSubscription.type,
        status: newSubscription.status,
        lessonsPerMonth: newSubscription.lessonsPerMonth
      },
      user: {
        _id: updateResult?._id,
        firstName: updateResult?.firstName,
        lastName: updateResult?.lastName,
        email: updateResult?.email,
        role: updateResult?.role,
        subscription: updateResult?.subscription
      }
    });

  } catch (error) {
    console.error('❌ Error creating test subscription:', error);
    return res.status(500).json({ 
      error: 'Failed to create test subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 