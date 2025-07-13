import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/server/db';
import Subscription from '@/server/subscription/model';
import { findUserById } from '@/server/db';
import { stripe } from '@/lib/stripe';

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

    // Отменяем подписку в Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Обновляем статус в базе
    subscription.status = 'cancelled';
    subscription.autoRenewal = false;
    await subscription.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
} 