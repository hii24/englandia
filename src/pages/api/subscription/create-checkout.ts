import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, SUBSCRIPTION_TYPES, resolvePriceIdFor } from '@/lib/stripe';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { subscriptionType, userId } = req.body;

    if (!subscriptionType || !userId) {
      return res.status(400).json({ 
        error: 'subscriptionType and userId are required' 
      });
    }

    // Проверяем, что тип подписки валидный
    if (!SUBSCRIPTION_TYPES[subscriptionType as keyof typeof SUBSCRIPTION_TYPES]) {
      return res.status(400).json({ 
        error: 'Invalid subscription type' 
      });
    }

    const subscriptionConfig = SUBSCRIPTION_TYPES[subscriptionType as keyof typeof SUBSCRIPTION_TYPES];
    
    // Резолвим priceId: используем настроенный, либо вытаскиваем по productId
    const priceId = subscriptionConfig.priceId || await resolvePriceIdFor(subscriptionType as keyof typeof SUBSCRIPTION_TYPES);

    // Получаем данные пользователя
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Проверяем, что пользователь имеет роль 'guest' или 'student'
    if (user.role !== 'guest' && user.role !== 'student') {
      return res.status(400).json({ 
        error: 'Only guests and students can create subscriptions' 
      });
    }

    console.log('🔍 Creating checkout session for:', {
      userId,
      subscriptionType,
      userEmail: user.email,
      priceId
    });

    // Создаем Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN || process.env.FRONTEND_URL || 'https://englandia.me'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN || process.env.FRONTEND_URL || 'https://englandia.me'}/subscription/cancel`,
      metadata: {
        userId: String(user._id),
        subscriptionType: subscriptionType,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`
      },
      subscription_data: {
        metadata: {
          userId: String(user._id),
          subscriptionType: subscriptionType,
          lessonsPerMonth: subscriptionConfig.lessonsPerMonth.toString()
        }
      }
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      url: session.url
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session' 
    });
  }
} 