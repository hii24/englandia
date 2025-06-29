import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

export const getStripePublishableKey = () => {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('STRIPE_PUBLISHABLE_KEY is not set');
  }
  return key;
};

// Типы подписок
export const SUBSCRIPTION_TYPES = {
  BASIC: {
    id: 'basic',
    name: 'Базовый',
    lessonsPerMonth: 4,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    description: '4 урока в месяц - идеально для начинающих'
  },
  INTENSIVE: {
    id: 'intensive',
    name: 'Интенсивный',
    lessonsPerMonth: 8,
    priceId: process.env.STRIPE_INTENSIVE_PRICE_ID,
    description: '8 уроков в месяц - для быстрого прогресса'
  }
} as const;

export type SubscriptionType = keyof typeof SUBSCRIPTION_TYPES; 