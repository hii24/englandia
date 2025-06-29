import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Проверяем наличие переменных окружения
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    const hasBasicPriceId = !!process.env.STRIPE_BASIC_PRICE_ID;
    const hasIntensivePriceId = !!process.env.STRIPE_INTENSIVE_PRICE_ID;

    console.log('🔍 Проверка конфигурации Stripe:', {
      hasSecretKey,
      hasWebhookSecret,
      hasBasicPriceId,
      hasIntensivePriceId
    });

    return res.status(200).json({
      success: true,
      hasSecretKey,
      hasWebhookSecret,
      hasBasicPriceId,
      hasIntensivePriceId,
      message: 'Конфигурация Stripe проверена'
    });

  } catch (error) {
    console.error('❌ Ошибка проверки конфигурации Stripe:', error);
    return res.status(500).json({ 
      error: 'Failed to check Stripe configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 