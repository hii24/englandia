import type { NextApiRequest, NextApiResponse } from 'next';
import { handleRegistration } from '@/server/registration/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const testData = {
      firstName: 'Test',
      lastName: 'Teacher',
      email: `testteacher${Date.now()}@example.com`,
      role: 'teacher' as const,
      phone: '', // Пустой телефон
      age: 25
    };

    console.log('Testing teacher registration with data:', testData);
    
    const result = await handleRegistration(testData);
    
    return res.status(200).json({
      success: true,
      message: 'Teacher registration successful',
      user: {
        _id: result.user._id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        phone: result.user.phone
      },
      plainPassword: result.plainPassword
    });
  } catch (error: any) {
    console.error('Teacher registration test failed:', error);
    
    return res.status(400).json({
      success: false,
      error: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 