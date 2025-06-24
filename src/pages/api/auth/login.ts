import type { NextApiRequest, NextApiResponse } from 'next';
import { handleLogin } from '@/server/auth/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email и пароль обязательны',
        type: 'validation'
      });
    }

    const result = await handleLogin(email, password);
    
    return res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Вход выполнен успешно'
    });
  } catch (e: any) {
    console.error('Ошибка логина:', e);
    
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