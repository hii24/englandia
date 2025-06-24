import axios from 'axios';
import type { RegistrationData } from "@/types/registration";
import { useUserStore } from '@/store/userStore';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export async function sendRegistration(data: RegistrationData) {
  try {
    const response = await api.post('/registration', data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Ошибка регистрации";
    throw new Error(errorMessage);
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    console.log('Начинаем вход с данными:', data);
    const response = await api.post('/auth/login', data);
    console.log('Ответ сервера:', response.data);
    
    const { user, token } = response.data.data;
    console.log('Получены данные пользователя:', user);
    console.log('Получен токен:', token ? 'да' : 'нет');
    
    // Сохраняем данные пользователя в store
    const store = useUserStore.getState();
    store.login(user, token);
    
    // Проверяем, что данные сохранились
    const updatedState = useUserStore.getState();
    console.log('Состояние store после входа:', {
      isAuthenticated: updatedState.isAuthenticated,
      user: updatedState.user ? 'есть' : 'нет',
      token: updatedState.token ? 'есть' : 'нет'
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при входе:', error);
    const errorMessage = error.response?.data?.error || "Ошибка входа";
    throw new Error(errorMessage);
  }
}

// Функция для выхода из системы
export function logoutUser() {
  useUserStore.getState().logout();
}

// Функция для проверки аутентификации
export function isAuthenticated(): boolean {
  return useUserStore.getState().isAuthenticated;
}

// Экспортируем экземпляр api для использования в других местах
export { api }; 