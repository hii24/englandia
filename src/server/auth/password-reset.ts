import { findUserByEmail, updateUser } from '../db';
import { generatePassword, hashPassword } from '../registration/utils';
import { sendPasswordResetEmail } from '../registration/email';
import type { User } from '@/types/registration';

interface PasswordResetResult {
  user: Omit<User, 'password'>;
  newPassword: string;
}

export async function handlePasswordReset(email: string): Promise<PasswordResetResult> {
  console.log('handlePasswordReset called with email:', email ? email.substring(0, 3) + '***' : 'missing');
  
  // Валидация email
  if (!email || !email.trim()) {
    const error = new Error('Email обязателен');
    (error as any).name = 'ValidationError';
    throw error;
  }

  // Проверка формата email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error('Некорректный формат email');
    (error as any).name = 'ValidationError';
    throw error;
  }

  console.log('Looking for user in database...');
  // Поиск пользователя по email
  const user = await findUserByEmail(email.toLowerCase());
  
  if (!user) {
    console.log('User not found for email:', email);
    const error = new Error('Пользователь с таким email не найден');
    (error as any).name = 'NotFoundError';
    throw error;
  }

  console.log('User found, generating new password...');
  // Генерация нового пароля
  const newPassword = generatePassword(10); // Генерируем пароль длиной 10 символов
  
  // Хэширование нового пароля
  const hashedPassword = await hashPassword(newPassword);
  
  console.log('Updating user password in database...');
  // Обновление пароля в базе данных
  const updatedUser = await updateUser(user._id.toString(), { password: hashedPassword });
  
  if (!updatedUser) {
    console.error('Failed to update user password');
    const error = new Error('Ошибка обновления пароля');
    (error as any).name = 'ServerError';
    throw error;
  }

  console.log('Sending password reset email...');
  // Отправка email с новым паролем
  try {
    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      newPassword: newPassword,
    });
    console.log('Password reset email sent successfully');
  } catch (emailError) {
    console.error('Ошибка отправки email с новым паролем:', emailError);
    // Не прерываем процесс, если email не отправился
    // В реальном проекте можно добавить очередь для повторной отправки
  }

  // Возвращаем пользователя без пароля и новый пароль для отладки
  const { password, ...userWithoutPassword } = updatedUser;
  
  console.log('Password reset successful for user:', user.email);
  return {
    user: userWithoutPassword,
    newPassword, // В продакшене убрать
  };
} 