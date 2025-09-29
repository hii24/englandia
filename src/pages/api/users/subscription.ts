import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import Subscription from '@/server/subscription/model';
import { stripe } from '@/lib/stripe';
import StudentProgress from '@/server/progress/model';

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

    // Получаем пользователя с подпиской
    const user = await findUserById(userId as string);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let subscriptionInfo = null;
    let cancelAtPeriodEnd = false;
    let lessonsLeft = null;
    let actualEndDate = null;

    if (user.subscription) {
      const subscription = await Subscription.findById(user.subscription);
      if (subscription) {
        // Получаем данные из Stripe
        let stripeSub: any = null;
        if (subscription.stripeSubscriptionId) {
          try {
            stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
            cancelAtPeriodEnd = !!stripeSub.cancel_at_period_end;
            if (stripeSub.cancel_at && stripeSub.cancel_at * 1000 > Date.now()) {
              actualEndDate = new Date(stripeSub.cancel_at * 1000);
            } else if (stripeSub.current_period_end) {
              actualEndDate = new Date(stripeSub.current_period_end * 1000);
            }
          } catch (e) {
            // Stripe не доступен — fallback на локальные данные
            cancelAtPeriodEnd = false;
            actualEndDate = subscription.endDate;
          }
        } else {
          actualEndDate = subscription.endDate;
        }

        // Считаем оставшиеся уроки за текущий биллинговый период
        if (user.role === 'student') {
          // Определяем начало текущего периода (из Stripe, если доступно)
          let periodStart = subscription.startDate;
          if (stripeSub && stripeSub.current_period_start) {
            periodStart = new Date(stripeSub.current_period_start * 1000);
          }

          // Определяем длительность периода в месяцах по данным Stripe
          let periodMonths = 1;
          try {
            const recurring = stripeSub?.items?.data?.[0]?.price?.recurring;
            const interval = recurring?.interval as 'day' | 'week' | 'month' | 'year' | undefined;
            const intervalCount = (recurring?.interval_count as number | undefined) || 1;
            if (interval === 'month') {
              periodMonths = intervalCount;
            } else if (interval === 'year') {
              periodMonths = 12 * intervalCount;
            } else {
              // Для day/week сохраняем период как 1 месяц (консервативно)
              periodMonths = 1;
            }
          } catch {
            periodMonths = 1;
          }

          const now = new Date();
          // Считаем завершённые уроки за период
          const completedLessons = await StudentProgress.countDocuments({
            studentId: user._id,
            attended: true,
            attendanceDate: { $gte: periodStart, $lte: now }
          });

          const allowedLessonsThisPeriod = (subscription.lessonsPerMonth || 0) * periodMonths;
          lessonsLeft = Math.max(0, allowedLessonsThisPeriod - completedLessons);
        }

        subscriptionInfo = {
          type: subscription.type,
          status: subscription.status,
          lessonsPerMonth: subscription.lessonsPerMonth,
          startDate: subscription.startDate,
          endDate: actualEndDate,
          autoRenewal: subscription.autoRenewal,
          cancelAtPeriodEnd,
          lessonsLeft
        };
      }
    }

    // Определяем название пакета
    let packageName = '—';
    if (subscriptionInfo) {
      if (subscriptionInfo.type === 'basic') {
        packageName = 'Базовый (8 уроков/мес)';
      } else if (subscriptionInfo.type === 'standard') {
        packageName = 'Стандарт (24 урока/мес)';
      } else if (subscriptionInfo.type === 'premium') {
        packageName = 'Премиум (48 уроков/мес)';
      }
    } else if (user.role === 'guest') {
      packageName = 'Гостевой доступ';
    }

    const response = {
      success: true,
      subscription: subscriptionInfo,
      packageName: packageName,
      userRole: user.role
    };

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch subscription info',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 