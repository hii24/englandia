import type { NextApiRequest, NextApiResponse } from 'next';
import { handleRegistration } from '@/server/registration/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName = '', lastName = '' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Используем тот же механизм регистрации, что и для обычных пользователей
    const result = await handleRegistration({
      email,
      firstName,
      lastName,
      role: 'teacher',
      // пароль будет сгенерирован автоматически внутри handleRegistration
    });
    // Не возвращаем plainPassword в ответе
    const { plainPassword, ...responseData } = result;
    return res.status(200).json({ success: true, data: responseData });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to register teacher' });
  }
} 