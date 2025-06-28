'use client';

import { useState } from 'react';

export default function TestFullCyclePage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Реальные ID из вашей системы
  const REAL_STUDENT_ID = '68603c91fc0d6a6d785f5f8b';
  const REAL_TEACHER_ID = '685d67e3d5e671c77b9fe8b5';
  const REAL_LESSON_ID = '685d692ad5e671c77b9fe8bc';

  const testFullCycle = async () => {
    setLoading(true);
    setTestResult('🔄 Начинаем тестирование полного цикла...\n\n');
    
    try {
      // Шаг 1: Создаем расписание учителя
      setTestResult(prev => prev + '📅 Шаг 1: Создаем расписание учителя...\n');
      
      const scheduleResponse = await fetch('/api/schedule/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: REAL_STUDENT_ID,
          teacherId: REAL_TEACHER_ID,
          enabled: true,
          daysSchedule: [
            { day: 'tuesday', time: '22:10', enabled: true },
            { day: 'thursday', time: '19:00', enabled: true },
            { day: 'saturday', time: '10:00', enabled: false }
          ],
          timezone: 'Europe/Moscow'
        })
      });
      
      const scheduleData = await scheduleResponse.json();
      setTestResult(prev => prev + `✅ Расписание создано: ${JSON.stringify(scheduleData, null, 2)}\n\n`);
      
      // Шаг 2: Проверяем состояние хранилища
      setTestResult(prev => prev + '📊 Шаг 2: Проверяем состояние хранилища...\n');
      
      const storageResponse = await fetch('/api/debug/schedule-storage');
      const storageData = await storageResponse.json();
      setTestResult(prev => prev + `📊 Состояние хранилища: ${JSON.stringify(storageData, null, 2)}\n\n`);
      
      // Шаг 3: Автоматическое назначение уроков
      setTestResult(prev => prev + '🎯 Шаг 3: Автоматическое назначение уроков...\n');
      
      const autoScheduleResponse = await fetch(`/api/lessons/auto-schedule?studentId=${REAL_STUDENT_ID}&teacherId=${REAL_TEACHER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date().toISOString().split('T')[0],
          lessonsCount: 4
        })
      });
      
      const autoScheduleData = await autoScheduleResponse.json();
      setTestResult(prev => prev + `🎯 Результат автоматического назначения: ${JSON.stringify(autoScheduleData, null, 2)}\n\n`);
      
      // Шаг 4: Проверяем расписание конкретного урока
      setTestResult(prev => prev + '📋 Шаг 4: Проверяем расписание урока...\n');
      
      const lessonScheduleResponse = await fetch(`/api/lessons/schedule?lessonId=${REAL_LESSON_ID}&studentId=${REAL_STUDENT_ID}&teacherId=${REAL_TEACHER_ID}`);
      const lessonScheduleData = await lessonScheduleResponse.json();
      setTestResult(prev => prev + `📋 Расписание урока: ${JSON.stringify(lessonScheduleData, null, 2)}\n\n`);
      
      // Шаг 5: Финальное состояние хранилища
      setTestResult(prev => prev + '📊 Шаг 5: Финальное состояние хранилища...\n');
      
      const finalStorageResponse = await fetch('/api/debug/schedule-storage');
      const finalStorageData = await finalStorageResponse.json();
      setTestResult(prev => prev + `📊 Финальное состояние: ${JSON.stringify(finalStorageData, null, 2)}\n\n`);
      
      setTestResult(prev => prev + '✅ Тестирование завершено!');
      
    } catch (error) {
      setTestResult(prev => prev + `❌ Ошибка: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/schedule-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      
      const data = await response.json();
      setTestResult(`🗑️ Хранилище очищено: ${data.message}`);
    } catch (error) {
      setTestResult(`❌ Ошибка очистки: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Тестирование полного цикла</h1>
      <p>Тестируем создание расписания и автоматическое назначение уроков</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testFullCycle} 
          disabled={loading}
          style={{ 
            marginRight: '10px', 
            padding: '10px', 
            backgroundColor: '#44aa44', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Тестирование...' : '🚀 Запустить полный цикл'}
        </button>
        
        <button 
          onClick={clearStorage} 
          disabled={loading}
          style={{ 
            padding: '10px', 
            backgroundColor: '#ff4444', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🗑️ Очистить хранилище
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Используемые ID:</h3>
        <ul>
          <li><strong>Student ID:</strong> {REAL_STUDENT_ID}</li>
          <li><strong>Teacher ID:</strong> {REAL_TEACHER_ID}</li>
          <li><strong>Lesson ID:</strong> {REAL_LESSON_ID}</li>
        </ul>
      </div>

      {testResult && (
        <div>
          <h2>Результат тестирования</h2>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '15px', 
            overflow: 'auto', 
            maxHeight: '600px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
} 