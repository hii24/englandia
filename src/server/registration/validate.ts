import type { RegistrationData } from '@/types/registration';

export function validateRegistration(data: RegistrationData) {
  if (!data.firstName || !data.email) {
    const error = new Error('Имя и email обязательны');
    (error as any).name = 'ValidationError';
    throw error;
  }
  if (typeof data.age !== 'number' || data.age < 4 || data.age > 12) {
    const error = new Error('Возраст ребенка должен быть от 4 до 12 лет');
    (error as any).name = 'ValidationError';
    throw error;
  }
  // Можно добавить другие проверки (email, телефон и т.д.)
} 