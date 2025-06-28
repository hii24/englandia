'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { LessonList } from '@/components/LessonList';
import { DashboardLoader } from '@/components/DashboardLoader';
import { useLessonStore } from '@/store/lessonStore';
import { useUserStore } from '@/store/userStore';

export default function DashboardPage() {
  const { lessons, loadLessons, loading, error } = useLessonStore();
  const user = useUserStore(s => s.user);
  const [hasLoadedLessons, setHasLoadedLessons] = useState(false);

  useEffect(() => {
    // Загружаем уроки только один раз когда пользователь авторизован
    if (user && !hasLoadedLessons) {
      console.log('Dashboard: User authenticated, loading lessons');
      loadLessons();
      setHasLoadedLessons(true);
    }
  }, [user, hasLoadedLessons, loadLessons]);

  return (
    <AuthGuard>
      <div>
        {(!user || loading) && <DashboardLoader />}
        {error && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Ошибка загрузки</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        )}
        {user && !loading && !error && <LessonList lessons={lessons} />}
      </div>
    </AuthGuard>
  );
} 