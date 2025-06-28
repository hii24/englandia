import type { NextApiRequest, NextApiResponse } from 'next';
import { handleLogin } from '@/server/auth/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Login-new endpoint called:', {
    method: req.method,
    body: req.body ? 'present' : 'missing',
    email: req.body?.email ? 'present' : 'missing'
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      allowedMethods: ['POST'],
      receivedMethod: req.method
    });
  }

  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email ? email.substring(0, 3) + '***' : 'missing');
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email и пароль обязательны',
        type: 'validation'
      });
    }

    console.log('Calling handleLogin...');
    const result = await handleLogin(email, password);
    console.log('Login successful for user:', result.user.email);
    
    return res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Вход выполнен успешно'
    });
  } catch (e: any) {
    console.error('Ошибка логина:', {
      name: e.name,
      message: e.message,
      stack: e.stack,
      code: e.code
    });
    
    if (e.name === 'ValidationError') {
      return res.status(400).json({ 
        error: e.message,
        type: 'validation'
      });
    }
    
    if (e.name === 'AuthError') {
      return res.status(401).json({ 
        error: e.message,
        type: 'auth'
      });
    }
    
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера. Попробуйте позже.',
      type: 'server'
    });
  }
} 