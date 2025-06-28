import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI not found'
      });
    }

    // Показываем структуру URI без пароля
    const uriParts = mongoUri.split('@');
    if (uriParts.length < 2) {
      return res.status(500).json({
        success: false,
        error: 'Invalid URI format'
      });
    }

    const authPart = uriParts[0];
    const restPart = uriParts[1];
    
    // Извлекаем username
    const username = authPart.replace('mongodb+srv://', '').split(':')[0];
    
    // Показываем безопасную версию
    const safeUri = `mongodb+srv://${username}:***@${restPart}`;

    return res.status(200).json({
      success: true,
      uri: {
        safe: safeUri,
        length: mongoUri.length,
        username: username,
        rest: restPart,
        // Показываем первые и последние символы для отладки
        start: mongoUri.substring(0, 30) + '...',
        end: '...' + mongoUri.substring(mongoUri.length - 30)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('URI exact error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to parse URI',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 