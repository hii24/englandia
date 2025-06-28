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
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export async function sendRegistration(data: RegistrationData) {
  try {
    const response = await api.post('/auth/registration', data);
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
  const response = await api.get(`/progress/student-lesson?studentId=${studentId}&lessonId=${lessonId}`);
  return response.data;
}

// Получить прогресс всех уроков ученика
export async function fetchStudentProgress(studentId: string) {
  const response = await api.get(`/progress/student?studentId=${studentId}`);
  return response.data;
}

// Сохранить индивидуальные lessonLink и homework
export async function saveStudentLesson(studentId: string, lessonId: string, lessonLink: any, homework: any[]) {
  const response = await api.put('/progress/student-lesson', { 
    studentId, 
    lessonId, 
    lessonLink, 
    homework 
  });
  return response.data;
}

// Обновить посещение урока
export async function updateAttendance(studentId: string, lessonId: string, attended: boolean, attendanceConfirmedBy: string) {
  const response = await api.put('/progress/student-lesson', {
    studentId, 
    lessonId, 
    attended, 
    attendanceDate: attended ? new Date().toISOString() : null,
    attendanceConfirmedBy: attended ? attendanceConfirmedBy : null
  });
  return response.data;
}

// Обновить статус урока
export async function updateLessonStatus(studentId: string, lessonId: string, status: 'not_started' | 'in_progress' | 'completed', confirmedBy: string) {
  const response = await api.put('/progress/student-lesson', {
    studentId, 
    lessonId, 
    status,
    attendanceConfirmedBy: confirmedBy
  });
  return response.data;
}

// Получить расписание урока
export async function getLessonSchedule(lessonId: string) {
  const response = await api.get(`/lessons/schedule?lessonId=${lessonId}`);
  return response.data;
}

// Обновить расписание урока
export async function updateLessonSchedule(lessonId: string, scheduleData: {
  scheduledDate?: string;
  scheduleEnabled?: boolean;
  schedulePattern?: '4_per_month' | '8_per_month';
}) {
  const response = await api.post('/lessons/schedule', { lessonId, ...scheduleData });
  return response.data;
}

// Экспортируем экземпляр api для использования в других местах
export { api }; 