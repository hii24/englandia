import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import Subscription from '@/server/subscription/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        error: 'userId is required' 
      });
    }

    console.log('🔍 Testing subscription for user:', userId);

    // Получаем пользователя
    const user = await findUserById(userId as string);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User found:', {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      hasSubscription: !!user.subscription,
      subscriptionId: user.subscription
    });

    let subscription = null;
    let subscriptionInfo = null;

    // Если у пользователя есть подписка, получаем её данные
    if (user.subscription) {
      console.log('🔍 Looking for subscription:', user.subscription);
      subscription = await Subscription.findById(user.subscription);
      
      if (subscription) {
        console.log('✅ Subscription found:', {
          _id: subscription._id,
          type: subscription.type,
          status: subscription.status,
          lessonsPerMonth: subscription.lessonsPerMonth,
          userId: subscription.userId
        });
        
        subscriptionInfo = {
          type: subscription.type,
          status: subscription.status,
          lessonsPerMonth: subscription.lessonsPerMonth,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          autoRenewal: subscription.autoRenewal
        };
      } else {
        console.log('❌ Subscription not found for ID:', user.subscription);
      }
    } else {
      console.log('ℹ️ User has no subscription field');
    }

    // Определяем название пакета
    let packageName = '—';
    if (subscriptionInfo) {
      if (subscriptionInfo.type === 'basic') {
        packageName = 'Базовый (4 урока/мес)';
      } else if (subscriptionInfo.type === 'intensive') {
        packageName = 'Интенсивный (8 уроков/мес)';
      } else {
        console.log('⚠️ Unknown subscription type:', subscriptionInfo.type);
      }
    } else if (user.role === 'guest') {
      packageName = 'Гостевой доступ';
    }

    console.log('📦 Final package name:', packageName);

    // Проверяем все подписки в базе
    const allSubscriptions = await Subscription.find({}).lean();
    console.log(`📊 Total subscriptions in database: ${allSubscriptions.length}`);

    const result = {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        hasSubscription: !!user.subscription,
        subscriptionId: user.subscription
      },
      subscription: subscription ? {
        _id: subscription._id,
        type: subscription.type,
        status: subscription.status,
        lessonsPerMonth: subscription.lessonsPerMonth,
        userId: subscription.userId,
        startDate: subscription.startDate
      } : null,
      subscriptionInfo: subscriptionInfo,
      packageName: packageName,
      allSubscriptions: allSubscriptions.map(sub => ({
        _id: sub._id?.toString(),
        type: sub.type,
        status: sub.status,
        userId: sub.userId?.toString()
      })),
      debug: {
        userSubscriptionField: user.subscription?.toString(),
        subscriptionFound: !!subscription,
        subscriptionIdMatch: subscription ? user.subscription?.toString() === subscription._id?.toString() : false
      }
    };

    console.log('📤 Sending test result:', result);

    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Error testing user subscription:', error);
    return res.status(500).json({ 
      error: 'Failed to test user subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 