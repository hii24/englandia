import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Test POST endpoint called:', {
    method: req.method,
    url: req.url,
    body: req.body
  });

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'GET работает!',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'POST работает!',
      receivedData: req.body,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ 
    error: 'Method Not Allowed',
    allowedMethods: ['GET', 'POST'],
    receivedMethod: req.method
  });
} 