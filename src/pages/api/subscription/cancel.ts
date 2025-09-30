import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Subscription from '@/server/subscription/model';
import { findUserById } from '@/server/db';
import { stripe } from '@/lib/stripe';
import { sendSubscriptionCancellationEmail } from '@/server/registration/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const user = await findUserById(userId);
    if (!user || !user.subscription) {
      return res.status(404).json({ error: 'Active subscription not found' });
    }

    const subscription = await Subscription.findById(user.subscription);
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({ error: 'Stripe subscription not found' });
    }

    // Отменяем подписку в Stripe (отмена в конце оплаченного периода)
    const updatedStripeSub = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Вычисляем фактическую дату окончания доступа
    let actualEndDate: Date | null = null;
    try {
      if ((updatedStripeSub as any).cancel_at && (updatedStripeSub as any).cancel_at * 1000 > Date.now()) {
        actualEndDate = new Date((updatedStripeSub as any).cancel_at * 1000);
      } else if ((updatedStripeSub as any).current_period_end) {
        actualEndDate = new Date((updatedStripeSub as any).current_period_end * 1000);
      }
    } catch {
      actualEndDate = null;
    }

    // Обновляем статус/дату в базе
    subscription.status = 'cancelled';
    subscription.autoRenewal = false;
    if (actualEndDate) {
      subscription.endDate = actualEndDate;
    }
    await subscription.save();

    // Письмо пользователю
    try {
      const userForEmail = await findUserById(userId);
      if (userForEmail?.email) {
        const planName = subscription.type === 'basic'
          ? 'Базовый (8 уроков/мес)'
          : subscription.type === 'standard'
          ? 'Стандарт (24 урока/мес)'
          : subscription.type === 'premium'
          ? 'Премиум (48 уроков/мес)'
          : undefined;
        await sendSubscriptionCancellationEmail({
          email: userForEmail.email,
          firstName: (userForEmail as any).firstName,
          lastName: (userForEmail as any).lastName,
          endDate: actualEndDate || subscription.endDate || undefined,
          planName,
        });
      }
    } catch (e) {
      console.warn('Не удалось отправить письмо об отмене подписки:', e);
    }

    return res.status(200).json({ success: true, cancelAtPeriodEnd: true, endDate: actualEndDate });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
} 