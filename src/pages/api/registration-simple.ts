import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Registration simple endpoint called:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

  // Разрешаем все методы для тестирования
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Registration endpoint is working',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'POST to registration endpoint is working',
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  }

  // Для всех остальных методов
  return res.status(405).json({ 
    error: 'Method Not Allowed',
    allowedMethods: ['GET', 'POST'],
    receivedMethod: req.method
  });
} 