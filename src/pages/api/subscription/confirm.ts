import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import { Payment } from '@/server/payments/model';
import Subscription from '@/server/subscription/model';
import { sendPaymentReceiptEmail } from '@/server/registration/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription', 'customer'] });
    if (!session || session.status !== 'complete' || !session.subscription) {
      return res.status(400).json({ error: 'Session not completed' });
    }

    const userId = (session.metadata as any)?.userId;
    const subscriptionType = (session.metadata as any)?.subscriptionType as 'BASIC' | 'STANDARD' | 'PREMIUM' | undefined;
    if (!userId || !subscriptionType) {
      return res.status(400).json({ error: 'Missing metadata' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Если роль уже student и есть активная подписка — считаем подтверждено
    if (user.subscription) {
      return res.status(200).json({ success: true, already: true });
    }

    const lessonsByType: Record<'BASIC' | 'STANDARD' | 'PREMIUM', number> = { BASIC: 8, STANDARD: 24, PREMIUM: 48 };
    const internalType: Record<'BASIC' | 'STANDARD' | 'PREMIUM', 'basic' | 'standard' | 'premium'> = {
      BASIC: 'basic', STANDARD: 'standard', PREMIUM: 'premium'
    };

    // Сохраняем платёж
    await Payment.create({
      userId: user._id,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      stripeSessionId: session.id,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: session.payment_status || 'unknown',
      eventType: 'manual_confirm',
      rawEvent: session
    });

    // Создаём подписку локально
    const newSubscription = await Subscription.create({
      userId: user._id,
      type: internalType[subscriptionType],
      status: 'active',
      startDate: new Date(),
      autoRenewal: true,
      lessonsPerMonth: lessonsByType[subscriptionType],
      stripeSubscriptionId: session.subscription as string,
      stripeCustomerId: session.customer as string,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await (await import('mongoose')).model('User').findByIdAndUpdate(userId, {
      role: 'student',
      subscription: newSubscription._id,
      updatedAt: new Date()
    });

    // Отправляем квитанцию
    try {
      const planName = internalType[subscriptionType] === 'basic' ? 'Базовый (8/мес)'
        : internalType[subscriptionType] === 'standard' ? 'Стандарт (24/мес)'
        : 'Премиум (48/мес)';
      await sendPaymentReceiptEmail({
        email: user.email,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || 'usd',
        planName,
        intervalText: undefined,
        sessionId: session.id,
      });
    } catch (e) {
      console.warn('⚠️ Не удалось отправить квитанцию (confirm):', e);
    }

    return res.status(200).json({ success: true, subscriptionId: newSubscription._id });
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return res.status(500).json({ error: 'Failed to confirm subscription' });
  }
}


