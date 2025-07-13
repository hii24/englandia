import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, SUBSCRIPTION_TYPES } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем priceId для каждого тарифа
    const basicPriceId = SUBSCRIPTION_TYPES.BASIC.priceId;
    const intensivePriceId = SUBSCRIPTION_TYPES.INTENSIVE.priceId;

    if (!basicPriceId || !intensivePriceId) {
      return res.status(500).json({ error: 'Stripe priceId not configured' });
    }

    // Получаем цены из Stripe
    const [basicPrice, intensivePrice] = await Promise.all([
      stripe.prices.retrieve(basicPriceId),
      stripe.prices.retrieve(intensivePriceId)
    ]);

    res.status(200).json({
      basic: basicPrice.unit_amount ? Math.round(basicPrice.unit_amount / 100) : null,
      basicCurrency: basicPrice.currency || '$',
      intensive: intensivePrice.unit_amount ? Math.round(intensivePrice.unit_amount / 100) : null,
      intensiveCurrency: intensivePrice.currency || '$'
    });
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
} 