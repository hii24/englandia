import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

// Обновленная модель для хранения расписания с разным временем для разных дней
interface DaySchedule {
  day: string;
  time: string;
  enabled: boolean;
}

interface TeacherSchedule {
  teacherId: string;
  studentId: string;
  enabled: boolean;
  daysSchedule: DaySchedule[];
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Временное хранилище расписаний (в реальном проекте использовать базу данных)
const schedules: TeacherSchedule[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    
    let studentId: string;
    let teacherId: string;
    
    // Получаем параметры из query или body
    if (req.method === 'GET') {
      studentId = req.query.studentId as string;
      teacherId = req.query.teacherId as string;
    } else {
      studentId = req.body.studentId || req.query.studentId as string;
      teacherId = req.body.teacherId || req.query.teacherId as string;
    }
    
    console.log('API /schedule/teacher:', {
      method: req.method,
      studentId,
      teacherId,
      body: req.body
    });

    if (!studentId || !teacherId) {
      return res.status(400).json({ error: 'studentId and teacherId are required' });
    }

    // Проверяем, что учитель существует и имеет правильную роль
    const teacher = await findUserById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ error: 'Unauthorized: Teacher not found' });
    }

    // Проверяем, что студент существует
    const student = await findUserById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (req.method === 'GET') {
      // Получаем расписание для конкретного студента и учителя
      const schedule = schedules.find(s => 
        s.teacherId === teacherId && s.studentId === studentId
      );
      
      if (!schedule) {
        // Возвращаем дефолтное расписание
        const defaultDaysSchedule = [
          { day: 'monday', time: '18:00', enabled: false },
          { day: 'tuesday', time: '18:00', enabled: false },
          { day: 'wednesday', time: '18:00', enabled: false },
          { day: 'thursday', time: '18:00', enabled: false },
          { day: 'friday', time: '18:00', enabled: false },
          { day: 'saturday', time: '18:00', enabled: false },
          { day: 'sunday', time: '18:00', enabled: false }
        ];
        
        return res.json({
          enabled: false,
          daysSchedule: defaultDaysSchedule,
          timezone: 'Europe/Moscow'
        });
      }
      
      return res.json({
        enabled: schedule.enabled,
        daysSchedule: schedule.daysSchedule,
        timezone: schedule.timezone
      });
    }

    if (req.method === 'POST') {
      const { enabled, daysSchedule, timezone } = req.body;
      
      console.log('POST schedule data:', {
        teacherId,
        studentId,
        enabled,
        daysSchedule,
        timezone
      });

      // Валидация данных
      if (enabled && (!daysSchedule || daysSchedule.length === 0)) {
        return res.status(400).json({ error: 'Days schedule is required when schedule is enabled' });
      }

      if (enabled && daysSchedule) {
        const hasEnabledDays = daysSchedule.some((day: DaySchedule) => day.enabled);
        if (!hasEnabledDays) {
          return res.status(400).json({ error: 'At least one day must be enabled when schedule is enabled' });
        }
      }

      // Находим существующее расписание или создаем новое
      const existingIndex = schedules.findIndex(s => 
        s.teacherId === teacherId && s.studentId === studentId
      );

      const scheduleData: TeacherSchedule = {
        teacherId,
        studentId,
        enabled: enabled || false,
        daysSchedule: daysSchedule || [],
        timezone: timezone || 'Europe/Moscow',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (existingIndex >= 0) {
        // Обновляем существующее расписание
        schedules[existingIndex] = {
          ...schedules[existingIndex],
          ...scheduleData,
          updatedAt: new Date()
        };
      } else {
        // Создаем новое расписание
        schedules.push(scheduleData);
      }

      console.log('Schedule saved successfully:', scheduleData);
      
      return res.json({ 
        success: true, 
        schedule: {
          enabled: scheduleData.enabled,
          daysSchedule: scheduleData.daysSchedule,
          timezone: scheduleData.timezone
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