import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Register mock endpoint called:', {
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
    const { email, firstName, lastName, phone, age } = req.body;
    
    console.log('Mock registration for:', email);
    
    // Валидация
    if (!email || !firstName || !lastName || !phone || !age) {
      return res.status(400).json({ 
        error: 'Все поля обязательны',
        type: 'validation'
      });
    }

    // Mock успешной регистрации
    const mockUser = {
      _id: 'mock-user-id',
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone,
      age: parseInt(age),
      role: 'guest' as const,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Mock registration successful for:', email);
    
    return res.status(200).json({ 
      success: true, 
      data: {
        user: mockUser,
        message: 'Mock регистрация прошла успешно! (БД недоступна)'
      }
    });
  } catch (e: any) {
    console.error('Mock registration error:', e);
    
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера. Попробуйте позже.',
      type: 'server'
    });
  }
} 