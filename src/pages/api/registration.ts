import type { NextApiRequest, NextApiResponse } from 'next';
import { handleRegistration } from '@/server/registration/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await handleRegistration(req.body);
    
    // В продакшене не возвращаем plainPassword
    const { plainPassword, ...responseData } = result;
    
    return res.status(200).json({ 
      success: true, 
      data: responseData,
      message: 'Регистрация прошла успешно! Проверьте email для получения данных для входа.'
    });
  } catch (e: any) {
    console.error('Ошибка регистрации:', e);
    
    if (e.name === 'ValidationError') {
      return res.status(400).json({ 
        error: e.message,
        type: 'validation'
      });
    }
    
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера. Попробуйте позже.',
      type: 'server'
    });
  }
} 