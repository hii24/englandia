import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Subscription from '@/server/subscription/model';
import { findUserById } from '@/server/db';
import { Schema, model, models } from 'mongoose';
import { Types } from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    console.log('🔍 Checking all subscriptions in database...');

    // Получаем все подписки
    const subscriptions = await Subscription.find({}).lean();
    console.log(`📊 Found ${subscriptions.length} subscriptions in database`);

    // Получаем всех пользователей с подписками
    const usersWithSubscriptions = [];
    for (const subscription of subscriptions) {
      try {
        const user = await findUserById(subscription.userId.toString());
        if (user) {
          usersWithSubscriptions.push({
            subscription: {
              _id: subscription._id?.toString(),
              type: subscription.type,
              status: subscription.status,
              lessonsPerMonth: subscription.lessonsPerMonth,
              startDate: subscription.startDate,
              userId: subscription.userId?.toString()
            },
            user: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              hasSubscriptionField: !!user.subscription,
              subscriptionFieldValue: user.subscription
            },
            subscriptionMatch: user.subscription?.toString() === subscription._id?.toString()
          });
        }
      } catch (error) {
        console.error('Error finding user for subscription:', subscription._id, error);
      }
    }

    // Проверяем пользователей с полем subscription, но без подписки
    const usersWithSubscriptionField = [];
    
    // Получаем всех пользователей напрямую из базы
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
    const allUsers = await User.find({}).lean();
    
    for (const user of allUsers) {
      if (user.subscription) {
        const subscription = subscriptions.find(sub => sub._id?.toString() === user.subscription?.toString());
        if (!subscription) {
          usersWithSubscriptionField.push({
            user: {
              _id: user._id?.toString(),
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              subscriptionFieldValue: user.subscription?.toString()
            },
            subscriptionExists: false
          });
        }
      }
    }

    const result = {
      totalSubscriptions: subscriptions.length,
      subscriptions: subscriptions,
      usersWithSubscriptions: usersWithSubscriptions,
      usersWithSubscriptionField: usersWithSubscriptionField,
      summary: {
        activeSubscriptions: subscriptions.filter(sub => sub.status === 'active').length,
        basicSubscriptions: subscriptions.filter(sub => sub.type === 'basic').length,
        intensiveSubscriptions: subscriptions.filter(sub => sub.type === 'intensive').length,
        matchedUsers: usersWithSubscriptions.filter(item => item.subscriptionMatch).length,
        unmatchedUsers: usersWithSubscriptions.filter(item => !item.subscriptionMatch).length,
        orphanedSubscriptionFields: usersWithSubscriptionField.length
      }
    };

    console.log('📊 Subscription check summary:', result.summary);

    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Error checking subscriptions:', error);
    return res.status(500).json({ 
      error: 'Failed to check subscriptions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 