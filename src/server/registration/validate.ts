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

  // Проверка телефона (обязателен только для студентов)
  if (data.role !== 'teacher' && (!data.phone || !data.phone.trim())) {
    const error = new Error('Телефон обязателен для заполнения');
    (error as any).name = 'ValidationError';
    throw error;
  }

  // Разная валидация возраста в зависимости от роли
  if (data.role === 'teacher') {
    // Для учителей: возраст необязателен, но если указан - от 18 до 100 лет
    if (data.age !== undefined && (typeof data.age !== 'number' || data.age < 18 || data.age > 100)) {
      const error = new Error('Возраст учителя должен быть от 18 до 100 лет');
      (error as any).name = 'ValidationError';
      throw error;
    }
  } else {
    // Для студентов: возраст обязателен от 4 до 12 лет
    if (typeof data.age !== 'number' || data.age < 4 || data.age > 12) {
      const error = new Error('Возраст ребенка должен быть от 4 до 12 лет');
      (error as any).name = 'ValidationError';
      throw error;
    }
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