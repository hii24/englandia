import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export const useAuthInit = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    isInitialized,
    setLoading, 
    setInitialized 
  } = useUserStore();

  useEffect(() => {
    const initAuth = async () => {
      // Если уже инициализировано, не делаем ничего
      if (isInitialized) {
        return;
      }

      setLoading(true);
      
      try {
        // Если есть токен, но нет пользователя, пытаемся восстановить сессию
        if (token && !user) {
          // Здесь можно добавить API вызов для проверки токена
          // const response = await fetch('/api/auth/verify', {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          // if (response.ok) {
          //   const userData = await response.json();
          //   setUser(userData);
          // } else {
          //   logout();
          // }
          
          console.log('Auth init: Token exists but no user, skipping verification for now');
        }
        
        // Помечаем как инициализированное
        setInitialized(true);
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Запускаем инициализацию только если еще не инициализировано
    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized, token, user, setLoading, setInitialized]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isInitialized
  };
}; 