import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing connection after whitelist update...');
    
    const { MongoClient } = await import('mongodb');
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB || 'englandia';
    
    if (!mongoUri) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI not found'
      });
    }

    console.log('Connecting to MongoDB...');
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected successfully!');

    const db = client.db(mongoDb);
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));

    await client.close();
    console.log('Connection closed');

    return res.status(200).json({
      success: true,
      message: 'Connection successful after whitelist update!',
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Connection test error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Connection failed',
      details: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 