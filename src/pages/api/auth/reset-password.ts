import type { NextApiRequest, NextApiResponse } from 'next';
import { handlePasswordReset } from '@/server/auth/password-reset';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Password reset API called:', {
    method: req.method,
    body: req.body ? 'present' : 'missing',
    email: req.body?.email ? 'present' : 'missing'
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;
    
    console.log('Password reset attempt for email:', email ? email.substring(0, 3) + '***' : 'missing');
    
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        error: 'Email обязателен',
        type: 'validation'
      });
    }

    console.log('Calling handlePasswordReset...');
    const result = await handlePasswordReset(email);
    console.log('Password reset successful for user:', result.user.email);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Новый пароль отправлен на ваш email'
    });
  } catch (e: any) {
    console.error('Ошибка восстановления пароля:', {
      name: e.name,
      message: e.message,
      stack: e.stack
    });
    
    if (e.name === 'ValidationError') {
      return res.status(400).json({ 
        error: e.message,
        type: 'validation'
      });
    }
    
    if (e.name === 'NotFoundError') {
      return res.status(404).json({ 
        error: e.message,
        type: 'not_found'
      });
    }
    
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера. Попробуйте позже.',
      type: 'server'
    });
  }
} 