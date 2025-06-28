import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const config = {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI?.length || 0,
      mongoDb: process.env.MONGODB_DB,
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD,
      timestamp: new Date().toISOString()
    };

    console.log('Debug config:', config);
    
    res.status(200).json({
      success: true,
      config,
      message: 'Configuration debug info'
    });
  } catch (error) {
    console.error('Debug config error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get config',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 