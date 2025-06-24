import { createUser } from '../db';
import { sendRegistrationEmail } from './email';
import { generatePassword, hashPassword } from './utils';
import { validateRegistration } from './validate';

import type { RegistrationData, User } from '@/types/registration';

export async function handleRegistration(data: RegistrationData): Promise<{ user: Omit<User, 'password'>, plainPassword: string }> {
  // Валидация данных
  validateRegistration(data);
  
  // Генерация пароля
  const plainPassword = generatePassword();
  
  // Хэширование пароля
  const hashedPassword = await hashPassword(plainPassword);
  
  // Создание пользователя
  const user = await createUser({
    ...data,
    password: hashedPassword,
  });
  
  // Отправка email с данными для входа
  try {
    await sendRegistrationEmail({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: plainPassword,
    });
  } catch (emailError) {
    console.error('Ошибка отправки email:', emailError);
    // Не прерываем регистрацию, если email не отправился
  }
  
  // Возвращаем пользователя без пароля и отдельно plain password для отладки
  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    plainPassword, // В продакшене убрать
  };
} 