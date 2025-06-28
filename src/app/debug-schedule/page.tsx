'use client';

import { useState, useEffect } from 'react';

interface StorageStatus {
  teacherSchedulesCount: number;
  lessonSchedulesCount: number;
  teacherSchedules: any[];
  lessonSchedules: any[];
}

export default function DebugSchedulePage() {
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const fetchStorageStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/schedule-storage');
      const data = await response.json();
      setStorageStatus(data.status);
    } catch (error) {
      console.error('Error fetching storage status:', error);
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
      setTestResult(data.message);
      await fetchStorageStatus();
    } catch (error) {
      console.error('Error clearing storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const testTeacherSchedule = async () => {
    setLoading(true);
    try {
      // Создаем тестовое расписание учителя
      const response = await fetch('/api/schedule/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: 'test-teacher-id',
          studentId: 'test-student-id',
          enabled: true,
          daysSchedule: [
            { day: 'monday', time: '18:00', enabled: true },
            { day: 'wednesday', time: '19:00', enabled: true },
            { day: 'friday', time: '20:00', enabled: false }
          ],
          timezone: 'Europe/Moscow'
        })
      });
      
      const data = await response.json();
      setTestResult(`Teacher schedule created: ${JSON.stringify(data, null, 2)}`);
      await fetchStorageStatus();
    } catch (error) {
      console.error('Error creating teacher schedule:', error);
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAutoSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lessons/auto-schedule?studentId=test-student-id&teacherId=test-teacher-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date().toISOString().split('T')[0],
          lessonsCount: 4
        })
      });
      
      const data = await response.json();
      setTestResult(`Auto-schedule result: ${JSON.stringify(data, null, 2)}`);
      await fetchStorageStatus();
    } catch (error) {
      console.error('Error testing auto-schedule:', error);
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageStatus();
  }, []);

  return (
    <div className="debug-page" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Schedule Storage</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchStorageStatus} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px' }}
        >
          {loading ? 'Loading...' : 'Refresh Status'}
        </button>
        
        <button 
          onClick={clearStorage} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: '#ff4444', color: 'white' }}
        >
          Clear Storage
        </button>
        
        <button 
          onClick={testTeacherSchedule} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: '#44aa44', color: 'white' }}
        >
          Test Teacher Schedule
        </button>
        
        <button 
          onClick={testAutoSchedule} 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#4444ff', color: 'white' }}
        >
          Test Auto-Schedule
        </button>
      </div>

      {storageStatus && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Storage Status</h2>
          <p><strong>Teacher Schedules:</strong> {storageStatus.teacherSchedulesCount}</p>
          <p><strong>Lesson Schedules:</strong> {storageStatus.lessonSchedulesCount}</p>
          
          {storageStatus.teacherSchedules.length > 0 && (
            <div>
              <h3>Teacher Schedules:</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                {JSON.stringify(storageStatus.teacherSchedules, null, 2)}
              </pre>
            </div>
          )}
          
          {storageStatus.lessonSchedules.length > 0 && (
            <div>
              <h3>Lesson Schedules:</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                {JSON.stringify(storageStatus.lessonSchedules, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

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