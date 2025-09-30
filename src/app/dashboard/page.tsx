'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { LessonList } from '@/components/LessonList';
import { DashboardLoader } from '@/components/DashboardLoader';
import { useLessonStore } from '@/store/lessonStore';
import { useUserStore } from '@/store/userStore';
import { useModal } from '@/hooks/useModal';

export default function DashboardPage() {
  const { lessons, loadLessons, loading, error } = useLessonStore();
  const user = useUserStore(s => s.user);
  const [hasLoadedLessons, setHasLoadedLessons] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openPaymentSuccessModal, openPaymentCancelModal } = useModal();
  const modalOpenedRef = useRef(false);

  useEffect(() => {
    // Загружаем уроки только один раз когда пользователь авторизован
    if (user && !hasLoadedLessons) {
      console.log('Dashboard: User authenticated, loading lessons');
      loadLessons();
      setHasLoadedLessons(true);
    }
  }, [user, hasLoadedLessons, loadLessons]);

  // Открываем модалки оплаты по query параметрам (после редиректа из Stripe)
  useEffect(() => {
    if (modalOpenedRef.current) return;
    const paymentStatus = searchParams?.get('payment');
    const sessionId = searchParams?.get('session_id');
    if (paymentStatus === 'success') {
      openPaymentSuccessModal({ sessionId: sessionId || undefined });
      modalOpenedRef.current = true;
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      router.replace(url.pathname);
    } else if (paymentStatus === 'cancel') {
      openPaymentCancelModal();
      modalOpenedRef.current = true;
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      router.replace(url.pathname);
    }
  }, [searchParams, openPaymentSuccessModal, openPaymentCancelModal, router]);

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