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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { userId, eventType } = req.body;

    if (!userId || !eventType) {
      return res.status(400).json({ 
        error: 'userId and eventType are required' 
      });
    }

    console.log('🎭 Симулируем webhook событие:', {
      userId,
      eventType
    });

    // Получаем пользователя
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oldRole = user.role;

    // Симулируем логику webhook в зависимости от типа события
    switch (eventType) {
      case 'checkout.session.completed': {
        // Симулируем успешную оплату подписки
        if (user.role === 'guest') {
          const updatedUser = await User.findByIdAndUpdate(userId, {
            role: 'student',
            updatedAt: new Date()
          }, { new: true });

          console.log('✅ Симулирована успешная оплата подписки:', {
            userId,
            oldRole,
            newRole: 'student',
            userEmail: user.email
          });

          return res.status(200).json({
            success: true,
            message: 'Successfully simulated checkout.session.completed',
            eventType: 'checkout.session.completed',
            user: {
              _id: updatedUser?._id,
              firstName: updatedUser?.firstName,
              lastName: updatedUser?.lastName,
              email: updatedUser?.email,
              role: updatedUser?.role,
              oldRole: oldRole
            }
          });
        } else {
          return res.status(400).json({
            error: 'User is not a guest, cannot simulate subscription activation'
          });
        }
      }

      case 'customer.subscription.canceled': {
        // Симулируем отмену подписки
        if (user.role === 'student') {
          const updatedUser = await User.findByIdAndUpdate(userId, {
            role: 'guest',
            updatedAt: new Date()
          }, { new: true });

          console.log('❌ Симулирована отмена подписки:', {
            userId,
            oldRole,
            newRole: 'guest',
            userEmail: user.email
          });

          return res.status(200).json({
            success: true,
            message: 'Successfully simulated customer.subscription.canceled',
            eventType: 'customer.subscription.canceled',
            user: {
              _id: updatedUser?._id,
              firstName: updatedUser?.firstName,
              lastName: updatedUser?.lastName,
              email: updatedUser?.email,
              role: updatedUser?.role,
              oldRole: oldRole
            }
          });
        } else {
          return res.status(400).json({
            error: 'User is not a student, cannot simulate subscription cancellation'
          });
        }
      }

      case 'customer.subscription.deleted': {
        // Симулируем удаление подписки
        if (user.role === 'student') {
          const updatedUser = await User.findByIdAndUpdate(userId, {
            role: 'guest',
            updatedAt: new Date()
          }, { new: true });

          console.log('🗑️ Симулировано удаление подписки:', {
            userId,
            oldRole,
            newRole: 'guest',
            userEmail: user.email
          });

          return res.status(200).json({
            success: true,
            message: 'Successfully simulated customer.subscription.deleted',
            eventType: 'customer.subscription.deleted',
            user: {
              _id: updatedUser?._id,
              firstName: updatedUser?.firstName,
              lastName: updatedUser?.lastName,
              email: updatedUser?.email,
              role: updatedUser?.role,
              oldRole: oldRole
            }
          });
        } else {
          return res.status(400).json({
            error: 'User is not a student, cannot simulate subscription deletion'
          });
        }
      }

      default:
        return res.status(400).json({
          error: 'Unsupported event type. Supported: checkout.session.completed, customer.subscription.canceled, customer.subscription.deleted'
        });
    }

  } catch (error) {
    console.error('❌ Ошибка симуляции webhook:', error);
    return res.status(500).json({ 
      error: 'Failed to simulate webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 