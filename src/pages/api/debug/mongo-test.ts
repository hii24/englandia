import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing MongoDB connection variants...');
    
    const { MongoClient } = await import('mongodb');
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB || 'englandia';
    
    if (!mongoUri) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI not found'
      });
    }

    // Вариант 1: Простая строка подключения
    console.log('Testing simple connection...');
    try {
      const client1 = new MongoClient(mongoUri);
      await client1.connect();
      const db1 = client1.db(mongoDb);
      const collections1 = await db1.listCollections().toArray();
      await client1.close();
      
      return res.status(200).json({
        success: true,
        method: 'simple',
        collections: collections1.map(c => c.name),
        message: 'Simple connection works!'
      });
    } catch (error1) {
      console.log('Simple connection failed:', error1);
    }

    // Вариант 2: С минимальными опциями
    console.log('Testing minimal options...');
    try {
      const client2 = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      await client2.connect();
      const db2 = client2.db(mongoDb);
      const collections2 = await db2.listCollections().toArray();
      await client2.close();
      
      return res.status(200).json({
        success: true,
        method: 'minimal',
        collections: collections2.map(c => c.name),
        message: 'Minimal options work!'
      });
    } catch (error2) {
      console.log('Minimal options failed:', error2);
    }

    // Вариант 3: Без SSL
    console.log('Testing without SSL...');
    try {
      const uriWithoutSSL = mongoUri.replace(/[?&](ssl|tls)=[^&]*/g, '');
      const client3 = new MongoClient(uriWithoutSSL);
      await client3.connect();
      const db3 = client3.db(mongoDb);
      const collections3 = await db3.listCollections().toArray();
      await client3.close();
      
      return res.status(200).json({
        success: true,
        method: 'no-ssl',
        collections: collections3.map(c => c.name),
        message: 'No SSL works!'
      });
    } catch (error3) {
      console.log('No SSL failed:', error3);
    }

    return res.status(500).json({
      success: false,
      error: 'All connection methods failed',
      mongoUriLength: mongoUri.length
    });

  } catch (error) {
    console.error('MongoDB test error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'MongoDB test failed',
      details: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : 'Unknown error'
    });
  }
} 