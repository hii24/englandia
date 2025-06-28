import type { NextApiRequest, NextApiResponse } from 'next';
import { handleRegistration } from '@/server/registration/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Register-new endpoint called:', {
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
    console.log('Calling handleRegistration...');
    const result = await handleRegistration(req.body);
    
    // В продакшене не возвращаем plainPassword
    const { plainPassword, ...responseData } = result;
    
    console.log('Registration successful for:', result.user.email);
    
    return res.status(200).json({ 
      success: true, 
      data: responseData,
      message: 'Регистрация прошла успешно! Проверьте email для получения данных для входа.'
    });
  } catch (e: any) {
    console.error('Ошибка регистрации:', {
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
    
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера. Попробуйте позже.',
      type: 'server'
    });
  }
} 