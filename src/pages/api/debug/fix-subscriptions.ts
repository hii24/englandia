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
    
    console.log('🔧 Starting subscription fix process...');

    // Получаем все подписки
    const subscriptions = await Subscription.find({}).lean();
    console.log(`📊 Found ${subscriptions.length} subscriptions`);

    // Получаем всех пользователей
    const allUsers = await fetch('/api/debug/users').then(res => res.json()).then(data => data.users || []);
    console.log(`👥 Found ${allUsers.length} users`);

    const results = {
      fixedUsers: [] as any[],
      orphanedSubscriptions: [] as any[],
      errors: [] as any[]
    };

    // Проверяем каждую подписку
    for (const subscription of subscriptions) {
      try {
        const user = await findUserById(subscription.userId?.toString() || '');
        if (user) {
          // Проверяем, есть ли у пользователя правильная ссылка на подписку
          if (!user.subscription || user.subscription.toString() !== subscription._id?.toString()) {
            console.log(`🔧 Fixing user ${user._id} subscription link`);
            
            await User.findByIdAndUpdate(user._id, {
              subscription: subscription._id,
              updatedAt: new Date()
            });

            results.fixedUsers.push({
              userId: user._id,
              userName: `${user.firstName} ${user.lastName}`,
              userEmail: user.email,
              subscriptionId: subscription._id?.toString(),
              subscriptionType: subscription.type,
              action: 'Fixed subscription link'
            });
          }
        } else {
          console.log(`⚠️ User not found for subscription ${subscription._id}`);
          results.orphanedSubscriptions.push({
            subscriptionId: subscription._id?.toString(),
            subscriptionType: subscription.type,
            userId: subscription.userId?.toString()
          });
        }
      } catch (error) {
        console.error(`❌ Error processing subscription ${subscription._id}:`, error);
        results.errors.push({
          subscriptionId: subscription._id?.toString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Проверяем пользователей с полем subscription, но без подписки
    for (const user of allUsers) {
      if (user.subscription) {
        const subscription = subscriptions.find(sub => sub._id?.toString() === user.subscription);
        if (!subscription) {
          console.log(`🔧 Removing orphaned subscription field from user ${user._id}`);
          
          await User.findByIdAndUpdate(user._id, {
            $unset: { subscription: 1 },
            updatedAt: new Date()
          });

          results.fixedUsers.push({
            userId: user._id,
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email,
            subscriptionId: user.subscription,
            action: 'Removed orphaned subscription field'
          });
        }
      }
    }

    console.log('✅ Subscription fix process completed');
    console.log('📊 Results:', {
      fixedUsers: results.fixedUsers.length,
      orphanedSubscriptions: results.orphanedSubscriptions.length,
      errors: results.errors.length
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription fix process completed',
      results: results,
      summary: {
        fixedUsers: results.fixedUsers.length,
        orphanedSubscriptions: results.orphanedSubscriptions.length,
        errors: results.errors.length
      }
    });

  } catch (error) {
    console.error('❌ Error fixing subscriptions:', error);
    return res.status(500).json({ 
      error: 'Failed to fix subscriptions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 