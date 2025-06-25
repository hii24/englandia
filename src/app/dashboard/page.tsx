'use client';

import { useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { LessonList } from '@/components/LessonList';
import { useLessonStore } from '@/store/lessonStore';

export default function DashboardPage() {
  const { lessons, loadLessons, loading, error } = useLessonStore();

  useEffect(() => {
    loadLessons();
  }, []);

  return (
    <AuthGuard>
      <div>
        {loading && <div>Загрузка...</div>}
        {error && <div style={{ color: 'red' }}>Ошибка: {error}</div>}
        {!loading && !error && <LessonList lessons={lessons} />}
      </div>
    </AuthGuard>
  );
} 