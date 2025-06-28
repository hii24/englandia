import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    
    const { studentId } = req.query;
    
    console.log('API /students/teacher:', {
      method: req.method,
      studentId
    });

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    // Проверяем, что studentId является валидным MongoDB ObjectId
    const isValidObjectId = (id: string) => {
      return /^[0-9a-fA-F]{24}$/.test(id);
    };

    if (studentId !== 'default' && !isValidObjectId(studentId as string)) {
      return res.status(400).json({ error: 'Invalid studentId format' });
    }

    // Проверяем, что студент существует (только если studentId не 'default')
    if (studentId !== 'default') {
      const student = await findUserById(studentId as string);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    if (req.method === 'GET') {
      // В реальном проекте здесь должна быть логика для получения teacherId
      // Пока возвращаем дефолтное значение для тестирования
      // TODO: Добавить связь ученик-учитель в базе данных
      
      // Для конкретного ученика возвращаем его teacherId
      if (studentId === '68603c91fc0d6a6d785f5f8b') {
        console.log('✅ Returning teacherId for student:', studentId);
        return res.json({
          teacherId: '685d67e3d5e671c77b9fe8b5', // Реальный teacherId
          studentId: studentId
        });
      }
      
      // Для всех остальных учеников возвращаем тот же teacherId для тестирования
      console.log('✅ Returning default teacherId for student:', studentId);
      return res.json({
        teacherId: '685d67e3d5e671c77b9fe8b5', // Используем тот же teacherId для всех
        studentId: studentId
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
} 