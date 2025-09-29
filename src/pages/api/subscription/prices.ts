import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, SUBSCRIPTION_TYPES, resolvePriceIdFor } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Резолвим priceIds для трёх тарифов
    const [basicPriceId, standardPriceId, premiumPriceId] = await Promise.all([
      resolvePriceIdFor('BASIC'),
      resolvePriceIdFor('STANDARD'),
      resolvePriceIdFor('PREMIUM')
    ]);

    // Получаем цены из Stripe
    const [basicPrice, standardPrice, premiumPrice] = await Promise.all([
      stripe.prices.retrieve(basicPriceId),
      stripe.prices.retrieve(standardPriceId),
      stripe.prices.retrieve(premiumPriceId)
    ]);

    res.status(200).json({
      basic: basicPrice.unit_amount ? Math.round(basicPrice.unit_amount / 100) : null,
      basicCurrency: basicPrice.currency || '$',
      standard: standardPrice.unit_amount ? Math.round(standardPrice.unit_amount / 100) : null,
      standardCurrency: standardPrice.currency || '$',
      premium: premiumPrice.unit_amount ? Math.round(premiumPrice.unit_amount / 100) : null,
      premiumCurrency: premiumPrice.currency || '$'
    });
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch prices', details });
  }
} 