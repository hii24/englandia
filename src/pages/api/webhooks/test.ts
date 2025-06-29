import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🧪 Test webhook endpoint called:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Test webhook endpoint is accessible',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'Test webhook endpoint received POST request',
      timestamp: new Date().toISOString(),
      method: req.method,
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 