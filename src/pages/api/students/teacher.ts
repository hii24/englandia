import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Schema, model, Types, models } from 'mongoose';

// Модель пользователя
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  age: Number,
  comment: String,
  password: String,
  role: { type: String, enum: ['admin', 'teacher', 'student', 'guest'], default: 'guest' },
  isEmailVerified: { type: Boolean, default: false },
  subscription: { type: Types.ObjectId, ref: 'Subscription' },
  teacherId: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

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
      // Находим первого учителя в базе данных
      const teacher = await User.findOne({ role: 'teacher' }).select('_id email firstName lastName');
      
      if (!teacher) {
        console.log('❌ No teacher found in database');
        return res.status(404).json({ error: 'No teacher found' });
      }
      
      console.log('✅ Returning teacherId for student:', studentId, 'teacher:', teacher._id);
      return res.json({
        teacherId: teacher._id.toString(),
        studentId: studentId,
        teacher: {
          _id: teacher._id,
          email: teacher.email,
          firstName: teacher.firstName,
          lastName: teacher.lastName
        }
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