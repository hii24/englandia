import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing different MongoDB passwords...');
    
    const { MongoClient } = await import('mongodb');
    const mongoDb = process.env.MONGODB_DB || 'englandia';
    
    // Возможные пароли
    const passwords = [
      'MM3D5gvys8ZZIwge',  // Старый пароль
      'MM3D5gvys8ZZIwge@', // Возможно с @
      'MM3D5gvys8ZZIwge%40', // URL encoded @
      'MM3D5gvys8ZZIwge%3A', // URL encoded :
    ];

    const baseUri = 'mongodb+srv://webenglandia:';
    const suffix = '@cluster0.g1oslk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    for (const password of passwords) {
      try {
        console.log(`Testing password: ${password}`);
        const uri = baseUri + password + suffix;
        
        const client = new MongoClient(uri);
        await client.connect();
        console.log(`Password ${password} works!`);
        
        const db = client.db(mongoDb);
        const collections = await db.listCollections().toArray();
        await client.close();
        
        return res.status(200).json({
          success: true,
          workingPassword: password,
          message: 'Found working password!',
          collections: collections.map(c => c.name),
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.log(`Password ${password} failed:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return res.status(500).json({
      success: false,
      error: 'No working password found',
      testedPasswords: passwords,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Password test error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Password test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 