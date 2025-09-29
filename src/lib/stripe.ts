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

// Типы подписок (3 тарифа: 8, 24, 48 уроков)
export const SUBSCRIPTION_TYPES = {
  BASIC: {
    id: 'basic',
    name: 'Базовый',
    lessonsPerMonth: 8,
    // Возможные источники priceId: STRIPE_PRICE_ID_8 или старый STRIPE_BASIC_PRICE_ID (для обратной совместимости)
    priceId: process.env.STRIPE_PRICE_ID_8 || process.env.STRIPE_BASIC_PRICE_ID,
    // Product ID для резолва priceId, если priceId не задан
    productId: process.env.STRIPE_PRODUCT_ID_8,
    description: '8 уроков в месяц'
  },
  STANDARD: {
    id: 'standard',
    name: 'Стандарт',
    lessonsPerMonth: 24,
    priceId: process.env.STRIPE_PRICE_ID_24,
    productId: process.env.STRIPE_PRODUCT_ID_24,
    description: '24 урока в месяц'
  },
  PREMIUM: {
    id: 'premium',
    name: 'Премиум',
    lessonsPerMonth: 48,
    priceId: process.env.STRIPE_PRICE_ID_48,
    productId: process.env.STRIPE_PRODUCT_ID_48,
    description: '48 уроков в месяц'
  }
} as const;

export type SubscriptionType = keyof typeof SUBSCRIPTION_TYPES;

// Резолв priceId: если priceId не задан, пытаемся получить default_price у продукта,
// иначе берём первый активный recurring price.
export async function resolvePriceIdFor(type: SubscriptionType): Promise<string> {
  const cfg = SUBSCRIPTION_TYPES[type];
  // Если в priceId случайно передан productId (prod_), корректно обработаем это как product
  const priceIdEnv = cfg.priceId;
  const productIdEnv = cfg.productId;

  if (priceIdEnv && priceIdEnv.startsWith('price_')) {
    return priceIdEnv;
  }

  const productIdToUse = priceIdEnv && priceIdEnv.startsWith('prod_')
    ? priceIdEnv
    : productIdEnv;

  if (!productIdToUse) {
    throw new Error(`Price ID not configured and productId missing for ${type}`);
  }

  // Пытаемся получить default_price
  const product = await stripe.products.retrieve(productIdToUse as string, { expand: ['default_price'] as any } as any);
  const defaultPrice: any = (product as any).default_price;
  if (defaultPrice) {
    return typeof defaultPrice === 'string' ? defaultPrice : defaultPrice.id;
  }
  // Иначе берём первый активный recurring price
  const prices = await stripe.prices.list({ product: productIdToUse as string, active: true, type: 'recurring', limit: 1 });
  if (prices.data.length > 0) {
    return prices.data[0].id;
  }
  throw new Error(`Unable to resolve priceId for product ${productIdToUse}`);
}