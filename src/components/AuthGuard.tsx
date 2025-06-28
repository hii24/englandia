'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthInit } from '@/hooks/useAuthInit';
import { AuthLoader } from './AuthLoader';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized } = useAuthInit();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Ждем завершения инициализации аутентификации
    if (isInitialized && !isLoading) {
      // Если не авторизован и еще не редиректили, перенаправляем на главную
      if (!isAuthenticated && !hasRedirected) {
        console.log('AuthGuard: User not authenticated, redirecting to home');
        setHasRedirected(true);
        // Используем setTimeout для избежания конфликтов рендеринга
        setTimeout(() => {
          router.push('/');
        }, 100);
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, hasRedirected, router]);

  // Показываем лоадер пока инициализируется аутентификация
  if (isLoading || !isInitialized) {
    return <AuthLoader />;
  }

  // Если не авторизован, показываем лоадер (происходит редирект)
  if (!isAuthenticated) {
    return <AuthLoader />;
  }

  // Если авторизован, показываем контент
  return <>{children}</>;
} 