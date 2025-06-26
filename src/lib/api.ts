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

// LESSONS API
export async function fetchLessons() {
  const response = await api.get('/lessons');
  return response.data;
}

export async function fetchLessonById(id: string) {
  const response = await api.get(`/lessons/${id}`);
  return response.data;
}

export async function createLesson(data: any) {
  const response = await api.post('/lessons', data);
  return response.data;
}

export async function updateLesson(id: string, data: any) {
  const response = await api.put(`/lessons/${id}`, data);
  return response.data;
}

export async function archiveLesson(id: string) {
  const response = await api.delete(`/lessons/${id}`);
  return response.data;
}

// USERS API
export async function fetchUsersByRole(role: string) {
  const response = await api.get(`/users?role=${role}`);
  return response.data;
}

export async function assignTeacherToStudent(studentId: string, teacherId: string) {
  const response = await api.patch(`/users/${studentId}`, { teacherId });
  return response.data;
}

// Получить индивидуальные lessonLink и homework
export async function fetchStudentLesson(studentId: string, lessonId: string) {
  const res = await fetch(`/api/progress/student-lesson?studentId=${studentId}&lessonId=${lessonId}`);
  if (!res.ok) throw new Error('Не удалось получить данные');
  return res.json();
}

// Сохранить индивидуальные lessonLink и homework
export async function saveStudentLesson(studentId: string, lessonId: string, lessonLink: any, homework: any[]) {
  const res = await fetch('/api/progress/student-lesson', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, lessonId, lessonLink, homework }),
  });
  if (!res.ok) throw new Error('Не удалось сохранить данные');
  return res.json();
}

// Экспортируем экземпляр api для использования в других местах
export { api }; 