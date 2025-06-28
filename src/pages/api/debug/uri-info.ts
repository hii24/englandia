import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB;
    
    if (!mongoUri) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI not found'
      });
    }

    // Показываем URI без пароля для безопасности
    const uriParts = mongoUri.split('@');
    const safeUri = uriParts.length > 1 
      ? `mongodb+srv://***:***@${uriParts[1]}`
      : 'mongodb+srv://***:***@***';

    // Анализируем параметры
    const url = new URL(mongoUri);
    const params = Object.fromEntries(url.searchParams.entries());

    return res.status(200).json({
      success: true,
      uri: {
        safe: safeUri,
        length: mongoUri.length,
        host: url.hostname,
        database: mongoDb,
        params: params
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('URI info error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to parse URI',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 