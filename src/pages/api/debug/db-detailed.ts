import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('DB detailed debug started');
    
    // Проверяем переменные окружения
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB;
    
    console.log('Environment variables:', {
      hasMongoUri: !!mongoUri,
      mongoUriLength: mongoUri?.length,
      mongoDb,
      nodeEnv: process.env.NODE_ENV
    });

    if (!mongoUri) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI not found',
        details: 'MongoDB URI is not set in environment variables'
      });
    }

    // Пробуем импортировать MongoDB
    console.log('Importing MongoDB...');
    const { MongoClient } = await import('mongodb');
    console.log('MongoDB imported successfully');

    // Создаем клиент
    console.log('Creating MongoDB client...');
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB client created');

    // Пробуем подключиться
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully');

    // Получаем базу данных
    console.log('Getting database...');
    const db = client.db(mongoDb || 'englandia');
    console.log('Database obtained');

    // Получаем коллекции
    console.log('Listing collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections listed successfully');

    // Закрываем соединение
    await client.close();
    console.log('Connection closed');

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('DB detailed debug error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 