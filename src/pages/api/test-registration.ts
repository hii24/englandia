import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Test registration endpoint called:', {
    method: req.method,
    body: req.body ? 'present' : 'missing'
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      allowedMethods: ['POST'],
      receivedMethod: req.method
    });
  }

  try {
    return res.status(200).json({ 
      success: true, 
      message: 'Test registration endpoint works!',
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test registration error:', error);
    return res.status(500).json({ 
      error: 'Test registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 