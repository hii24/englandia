import { NextApiRequest, NextApiResponse } from 'next';
import { sendSubscriptionEmail } from '@/server/registration/subscription-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId, studentEmail, studentName, lessonTitle } = req.body;

    if (!studentId || !studentEmail || !studentName || !lessonTitle) {
      return res.status(400).json({ 
        error: 'studentId, studentEmail, studentName, lessonTitle are required' 
      });
    }

    console.log('🧪 Тестируем функцию отправки email с подпиской:', {
      studentId,
      studentEmail,
      studentName,
      lessonTitle
    });

    // Вызываем функцию отправки email
    await sendSubscriptionEmail({
      studentId,
      studentEmail,
      studentName,
      lessonTitle
    });

    console.log('✅ Email функция выполнена успешно');

    return res.status(200).json({
      success: true,
      message: 'Email функция выполнена успешно. Проверьте консоль сервера для деталей.',
      data: {
        studentId,
        studentEmail,
        studentName,
        lessonTitle
      }
    });

  } catch (error) {
    console.error('❌ Ошибка тестирования email функции:', error);
    return res.status(500).json({ 
      error: 'Failed to test email function',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 