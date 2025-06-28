import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing imports...');
    
    // Тестируем импорт auth service
    console.log('Importing auth service...');
    const { handleLogin } = await import('@/server/auth/service');
    console.log('Auth service imported successfully');

    // Тестируем импорт registration service
    console.log('Importing registration service...');
    const { handleRegistration } = await import('@/server/registration/service');
    console.log('Registration service imported successfully');

    // Тестируем импорт db
    console.log('Importing db...');
    const { findUserByEmail } = await import('@/server/db');
    console.log('DB imported successfully');

    return res.status(200).json({
      success: true,
      message: 'All imports successful',
      imports: [
        'auth/service',
        'registration/service', 
        'db'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Import test error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Import failed',
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 