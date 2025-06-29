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

    console.log('🔍 API: Fetching subscription info for user:', userId);

    // Получаем пользователя с подпиской
    const user = await findUserById(userId as string);
    if (!user) {
      console.log('❌ API: User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ API: User found:', {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      hasSubscription: !!user.subscription,
      subscriptionId: user.subscription
    });

    let subscriptionInfo = null;

    // Если у пользователя есть подписка, получаем её данные
    if (user.subscription) {
      console.log('🔍 API: Looking for subscription:', user.subscription);
      const subscription = await Subscription.findById(user.subscription);
      
      if (subscription) {
        console.log('✅ API: Subscription found:', {
          subscriptionId: subscription._id,
          type: subscription.type,
          status: subscription.status,
          lessonsPerMonth: subscription.lessonsPerMonth
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
        console.log('❌ API: Subscription not found for ID:', user.subscription);
      }
    } else {
      console.log('ℹ️ API: User has no subscription field');
    }

    // Определяем название пакета
    let packageName = '—';
    if (subscriptionInfo) {
      if (subscriptionInfo.type === 'basic') {
        packageName = 'Базовый (4 урока/мес)';
      } else if (subscriptionInfo.type === 'intensive') {
        packageName = 'Интенсивный (8 уроков/мес)';
      } else {
        console.log('⚠️ API: Unknown subscription type:', subscriptionInfo.type);
      }
    } else if (user.role === 'guest') {
      packageName = 'Гостевой доступ';
    }

    console.log('📦 API: Final package name:', packageName);

    const response = {
      success: true,
      subscription: subscriptionInfo,
      packageName: packageName,
      userRole: user.role
    };

    console.log('📤 API: Sending response:', response);

    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error fetching subscription info:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch subscription info',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 