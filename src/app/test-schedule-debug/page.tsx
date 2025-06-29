'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function TestScheduleDebug() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [teacherSchedule, setTeacherSchedule] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonSchedules, setLessonSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserStore(s => s.user);
  const [storageStatus, setStorageStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'teacher') {
      loadStudents();
      loadLessons();
    }
  }, [user]);

  const loadStudents = async () => {
    try {
      const response = await fetch(`/api/users?role=student,guest&teacherId=${user?._id}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Ошибка загрузки учеников:', error);
    }
  };

  const loadLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Ошибка загрузки уроков:', error);
    }
  };

  const loadStudentSchedule = async (studentId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/schedule/teacher?studentId=${studentId}&teacherId=${user?._id}`);
      if (response.ok) {
        const data = await response.json();
        setTeacherSchedule(data);
      } else {
        setTeacherSchedule(null);
      }
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
      setTeacherSchedule(null);
    } finally {
      setLoading(false);
    }
  };

  const loadLessonSchedules = async (studentId: string) => {
    try {
      const schedules = [];
      for (const lesson of lessons) {
        const response = await fetch(`/api/lessons/schedule?lessonId=${lesson._id}&studentId=${studentId}&teacherId=${user?._id}`);
        if (response.ok) {
          const data = await response.json();
          schedules.push({ lessonId: lesson._id, lessonTitle: lesson.title, ...data });
        } else {
          schedules.push({ lessonId: lesson._id, lessonTitle: lesson.title, enabled: false });
        }
      }
      setLessonSchedules(schedules);
    } catch (error) {
      console.error('Ошибка загрузки расписания уроков:', error);
    }
  };

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    loadStudentSchedule(student._id);
    loadLessonSchedules(student._id);
  };

  const handleCreateSchedule = async () => {
    if (!selectedStudent) return;
    
    const scheduleData = {
      studentId: selectedStudent._id,
      teacherId: user?._id,
      enabled: true,
      daysSchedule: [
        { day: 'monday', time: '18:00', enabled: true },
        { day: 'tuesday', time: '18:00', enabled: false },
        { day: 'wednesday', time: '18:00', enabled: true },
        { day: 'thursday', time: '18:00', enabled: false },
        { day: 'friday', time: '18:00', enabled: false },
        { day: 'saturday', time: '10:00', enabled: false },
        { day: 'sunday', time: '10:00', enabled: false }
      ],
      timezone: 'Europe/Moscow'
    };

    try {
      const response = await fetch('/api/schedule/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });

      if (response.ok) {
        alert('Расписание создано!');
        await loadStudentSchedule(selectedStudent._id);
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error('Ошибка создания расписания:', error);
      alert('Ошибка создания расписания');
    }
  };

  const handleAutoSchedule = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await fetch(`/api/lessons/auto-schedule?studentId=${selectedStudent._id}&teacherId=${user?._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Автоматически назначено ${data.scheduledCount} из ${data.totalLessons} доступных уроков!`);
        await loadLessonSchedules(selectedStudent._id);
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error('Ошибка автоматического назначения:', error);
      alert('Ошибка автоматического назначения');
    }
  };

  const checkStorageStatus = async () => {
    try {
      const response = await fetch('/api/debug/schedule-storage');
      if (response.ok) {
        const data = await response.json();
        console.log('Storage status:', data);
        alert(`Статус хранилища:\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error('Ошибка проверки статуса:', error);
    }
  };

  const addResult = (message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message,
      data
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const loadStorageStatus = async () => {
    try {
      const response = await fetch('/api/debug/schedule-storage');
      const data = await response.json();
      setStorageStatus(data);
      addResult('✅ Storage status loaded', data);
    } catch (error) {
      addResult('❌ Failed to load storage status', error);
    }
  };

  const testCurrentSchedule = async () => {
    try {
      addResult('🔧 Checking current schedule storage...');
      
      const storageResponse = await fetch('/api/debug/schedule-storage');
      const storageData = await storageResponse.json();
      addResult('📊 Current storage status:', storageData);
      
      // Проверяем конкретное расписание для тестового ученика
      const scheduleResponse = await fetch('/api/lessons/schedule?lessonId=65f1a2b3c4d5e6f7g8h9i0j1&studentId=68603c91fc0d6a6d785f5f8b&teacherId=685d67e3d5e671c77b9fe8b5');
      const scheduleData = await scheduleResponse.json();
      addResult('📅 Specific lesson schedule:', scheduleData);
      
    } catch (error) {
      addResult('❌ Error checking current schedule:', error);
    }
  };

  const createTestScheduleWithRealIds = async () => {
    setLoading(true);
    try {
      addResult('🔧 Creating test schedule with real lesson IDs...');
      
      // Сначала получаем список уроков
      const lessonsResponse = await fetch('/api/lessons');
      const lessonsData = await lessonsResponse.json();
      addResult('📚 Available lessons:', lessonsData);
      
      if (lessonsData.length > 0) {
        const firstLesson = lessonsData[0];
        addResult('🎯 Using first lesson:', firstLesson);
        
        // Создаем расписание учителя
        const teacherScheduleResponse = await fetch('/api/schedule/teacher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherId: '685d67e3d5e671c77b9fe8b5',
            studentId: '68603c91fc0d6a6d785f5f8b',
            enabled: true,
            daysSchedule: [
              { day: 'monday', time: '18:00', enabled: true },
              { day: 'wednesday', time: '19:00', enabled: true },
              { day: 'friday', time: '17:00', enabled: false },
              { day: 'saturday', time: '10:00', enabled: false },
              { day: 'sunday', time: '10:00', enabled: false },
              { day: 'tuesday', time: '18:00', enabled: false },
              { day: 'thursday', time: '18:00', enabled: false }
            ],
            timezone: 'Europe/Moscow'
          })
        });

        if (teacherScheduleResponse.ok) {
          const teacherScheduleData = await teacherScheduleResponse.json();
          addResult('✅ Teacher schedule created:', teacherScheduleData);
          
          // Автоматически назначаем даты уроков
          const autoScheduleResponse = await fetch(`/api/lessons/auto-schedule?studentId=68603c91fc0d6a6d785f5f8b&teacherId=685d67e3d5e671c77b9fe8b5`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              startDate: new Date().toISOString().split('T')[0]
            })
          });

          if (autoScheduleResponse.ok) {
            const autoScheduleData = await autoScheduleResponse.json();
            addResult('✅ Lessons auto-scheduled:', autoScheduleData);
            
            // Проверяем расписание конкретного урока
            const lessonScheduleResponse = await fetch(`/api/lessons/schedule?lessonId=${firstLesson._id}&studentId=68603c91fc0d6a6d785f5f8b&teacherId=685d67e3d5e671c77b9fe8b5`);
            const lessonScheduleData = await lessonScheduleResponse.json();
            addResult('📅 First lesson schedule:', lessonScheduleData);
          } else {
            const error = await autoScheduleResponse.json();
            addResult('❌ Failed to auto-schedule lessons:', error);
          }
        } else {
          const error = await teacherScheduleResponse.json();
          addResult('❌ Failed to create teacher schedule:', error);
        }
      }
      
    } catch (error) {
      addResult('❌ Error creating test schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const testTeacherSchedule = async () => {
    setLoading(true);
    try {
      // 1. Создаем расписание учителя
      addResult('🔧 Step 1: Creating teacher schedule...');
      
      const teacherScheduleResponse = await fetch('/api/schedule/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: '685d67e3d5e671c77b9fe8b5',
          studentId: '68603c91fc0d6a6d785f5f8b',
          enabled: true,
          daysSchedule: [
            { day: 'monday', time: '18:00', enabled: true },
            { day: 'wednesday', time: '19:00', enabled: true },
            { day: 'friday', time: '17:00', enabled: false },
            { day: 'saturday', time: '10:00', enabled: false },
            { day: 'sunday', time: '10:00', enabled: false },
            { day: 'tuesday', time: '18:00', enabled: false },
            { day: 'thursday', time: '18:00', enabled: false }
          ],
          timezone: 'Europe/Moscow'
        })
      });

      if (teacherScheduleResponse.ok) {
        const teacherScheduleData = await teacherScheduleResponse.json();
        addResult('✅ Teacher schedule created', teacherScheduleData);
      } else {
        const error = await teacherScheduleResponse.json();
        addResult('❌ Failed to create teacher schedule', error);
        return;
      }

      // 2. Автоматически назначаем даты уроков
      addResult('🔧 Step 2: Auto-scheduling lessons...');
      
      const autoScheduleResponse = await fetch('/api/lessons/auto-schedule?studentId=68603c91fc0d6a6d785f5f8b&teacherId=685d67e3d5e671c77b9fe8b5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date().toISOString().split('T')[0]
        })
      });

      if (autoScheduleResponse.ok) {
        const autoScheduleData = await autoScheduleResponse.json();
        addResult('✅ Lessons auto-scheduled', autoScheduleData);
      } else {
        const error = await autoScheduleResponse.json();
        addResult('❌ Failed to auto-schedule lessons', error);
        return;
      }

      // 3. Проверяем расписание конкретного урока
      addResult('🔧 Step 3: Checking lesson schedule...');
      
      const lessonScheduleResponse = await fetch('/api/lessons/schedule?lessonId=65f1a2b3c4d5e6f7g8h9i0j1&studentId=68603c91fc0d6a6d785f5f8b&teacherId=685d67e3d5e671c77b9fe8b5');
      
      if (lessonScheduleResponse.ok) {
        const lessonScheduleData = await lessonScheduleResponse.json();
        addResult('✅ Lesson schedule retrieved', lessonScheduleData);
      } else {
        const error = await lessonScheduleResponse.json();
        addResult('❌ Failed to get lesson schedule', error);
      }

      // 4. Проверяем teacherId для студента
      addResult('🔧 Step 4: Checking student teacher...');
      
      const studentTeacherResponse = await fetch('/api/students/teacher?studentId=68603c91fc0d6a6d785f5f8b');
      
      if (studentTeacherResponse.ok) {
        const studentTeacherData = await studentTeacherResponse.json();
        addResult('✅ Student teacher retrieved', studentTeacherData);
      } else {
        const error = await studentTeacherResponse.json();
        addResult('❌ Failed to get student teacher', error);
      }

    } catch (error) {
      addResult('❌ Test failed with error', error);
    } finally {
      setLoading(false);
    }
  };

  const testLessonCardFlow = async () => {
    setLoading(true);
    try {
      addResult('🔧 Testing LessonCard flow...');
      
      // Симулируем запросы, которые делает LessonCard
      const teacherResponse = await fetch('/api/students/teacher?studentId=68603c91fc0d6a6d785f5f8b');
      const teacherData = await teacherResponse.json();
      addResult('📡 Teacher API response', teacherData);
      
      if (teacherData.teacherId) {
        const scheduleResponse = await fetch(`/api/lessons/schedule?lessonId=65f1a2b3c4d5e6f7g8h9i0j1&studentId=68603c91fc0d6a6d785f5f8b&teacherId=${teacherData.teacherId}`);
        const scheduleData = await scheduleResponse.json();
        addResult('📡 Schedule API response', scheduleData);
        
        // Показываем, что увидит ученик
        if (scheduleData.enabled && scheduleData.scheduledDate) {
          const scheduledDate = new Date(scheduleData.scheduledDate);
          const now = new Date();
          
          let statusText = '';
          if (scheduledDate < now) {
            statusText = `Пропущен (${scheduledDate.toLocaleDateString('ru-RU')} в ${scheduleData.time})`;
          } else if (scheduledDate.toDateString() === now.toDateString()) {
            statusText = `Сегодня в ${scheduleData.time}`;
          } else {
            statusText = `${scheduledDate.toLocaleDateString('ru-RU')} в ${scheduleData.time}`;
          }
        }
      }
      
    } catch (error) {
      addResult('❌ Error testing LessonCard flow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
}