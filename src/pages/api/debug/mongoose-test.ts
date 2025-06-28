import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing Mongoose connection...');
    
    const mongoose = await import('mongoose');
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB || 'englandia';
    
    if (!mongoUri) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI not found'
      });
    }

    // Проверяем, не подключены ли уже
    if (mongoose.connection.readyState >= 1) {
      console.log('Already connected to MongoDB');
      return res.status(200).json({
        success: true,
        method: 'mongoose-existing',
        message: 'Already connected to MongoDB',
        readyState: mongoose.connection.readyState
      });
    }

    // Подключаемся через mongoose
    console.log('Connecting via Mongoose...');
    await mongoose.connect(mongoUri);
    console.log('Connected via Mongoose');

    // Получаем список коллекций
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections obtained:', collections.map(c => c.name));

      return res.status(200).json({
        success: true,
        method: 'mongoose',
        collections: collections.map(c => c.name),
        message: 'Mongoose connection successful!',
        readyState: mongoose.connection.readyState
      });
    } else {
      return res.status(200).json({
        success: true,
        method: 'mongoose',
        message: 'Mongoose connected but db is undefined',
        readyState: mongoose.connection.readyState
      });
    }

  } catch (error) {
    console.error('Mongoose test error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Mongoose connection failed',
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : 'Unknown error'
    });
  }
} 