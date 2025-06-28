'use client';

import { useState, useEffect } from 'react';

export default function TestSchedulePage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testScheduleAPI = async () => {
    setLoading(true);
    try {
      // Используем реальные ID из вашей системы
      const response = await fetch('/api/lessons/schedule?lessonId=685d692ad5e671c77b9fe8bc&studentId=68603c91fc0d6a6d785f5f8b&teacherId=685d67e3d5e671c77b9fe8b5');
      const data = await response.json();
      
      setTestResult(`Schedule API Response:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testStorageStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/schedule-storage');
      const data = await response.json();
      
      setTestResult(`Storage Status:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestSchedule = async () => {
    setLoading(true);
    try {
      // Создаем тестовое расписание с реальными ID
      const response = await fetch('/api/lessons/schedule?lessonId=685d692ad5e671c77b9fe8bc&studentId=68603c91fc0d6a6d785f5f8b&teacherId=685d67e3d5e671c77b9fe8b5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: true,
          scheduledDate: new Date().toISOString(),
          time: '18:00',
          timezone: 'Europe/Moscow'
        })
      });
      
      const data = await response.json();
      setTestResult(`Test Schedule Created:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Schedule Display</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testScheduleAPI} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px' }}
        >
          Test Schedule API
        </button>
        
        <button 
          onClick={testStorageStatus} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px' }}
        >
          Check Storage Status
        </button>
        
        <button 
          onClick={createTestSchedule} 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#44aa44', color: 'white' }}
        >
          Create Test Schedule
        </button>
      </div>

      {testResult && (
        <div>
          <h2>Test Result</h2>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
} 