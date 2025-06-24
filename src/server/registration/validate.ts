import type { RegistrationData } from '@/types/registration';

export function validateRegistration(data: RegistrationData) {
  // Проверка обязательных полей
  if (!data.firstName || !data.firstName.trim()) {
    const error = new Error('Имя обязательно для заполнения');
    (error as any).name = 'ValidationError';
    throw error;
  }

  if (!data.lastName || !data.lastName.trim()) {
    const error = new Error('Фамилия обязательна для заполнения');
    (error as any).name = 'ValidationError';
    throw error;
  }

  if (!data.email || !data.email.trim()) {
    const error = new Error('Email обязателен для заполнения');
    (error as any).name = 'ValidationError';
    throw error;
  }

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    const error = new Error('Некорректный формат email');
    (error as any).name = 'ValidationError';
    throw error;
  }

  // Проверка телефона (только на заполненность)
  if (!data.phone || !data.phone.trim()) {
    const error = new Error('Телефон обязателен для заполнения');
    (error as any).name = 'ValidationError';
    throw error;
  }

  // Валидация возраста
  if (typeof data.age !== 'number' || data.age < 4 || data.age > 12) {
    const error = new Error('Возраст ребенка должен быть от 4 до 12 лет');
    (error as any).name = 'ValidationError';
    throw error;
  }

  // Валидация длины полей
  if (data.firstName.length < 2 || data.firstName.length > 50) {
    const error = new Error('Имя должно содержать от 2 до 50 символов');
    (error as any).name = 'ValidationError';
    throw error;
  }

  if (data.lastName.length < 2 || data.lastName.length > 50) {
    const error = new Error('Фамилия должна содержать от 2 до 50 символов');
    (error as any).name = 'ValidationError';
    throw error;
  }

  if (data.comment && data.comment.length > 500) {
    const error = new Error('Комментарий не должен превышать 500 символов');
    (error as any).name = 'ValidationError';
    throw error;
  }
} 