import { findUserByEmail } from '../db';
import { verifyPassword } from '../registration/utils';
import type { User } from '@/types/registration';
import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '1h'; // 1 час

interface LoginResult {
  user: Omit<User, 'password'>;
  token: string;
}

function generateJWT(user: User): string {
  // Можно добавить любые данные, которые нужны на клиенте
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    'static-secret-key-for-development',
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function handleLogin(email: string, password: string): Promise<LoginResult> {
  console.log('handleLogin called with email:', email ? email.substring(0, 3) + '***' : 'missing');
  
  // Валидация входных данных
  if (!email || !email.trim()) {
    const error = new Error('Email обязателен');
    (error as any).name = 'ValidationError';
    throw error;
  }

  if (!password || !password.trim()) {
    const error = new Error('Пароль обязателен');
    (error as any).name = 'ValidationError';
    throw error;
  }

  console.log('Looking for user in database...');
  // Поиск пользователя по email
  const user = await findUserByEmail(email.toLowerCase());
  
  if (!user) {
    console.log('User not found for email:', email);
    const error = new Error('Пользователь с таким email не найден');
    (error as any).name = 'AuthError';
    throw error;
  }

  console.log('User found, verifying password...');
  // Проверка пароля
  const isPasswordValid = await verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
    console.log('Invalid password for user:', email);
    const error = new Error('Неверный пароль');
    (error as any).name = 'AuthError';
    throw error;
  }

  // Проверка, что email подтвержден (опционально)
  if (!user.isEmailVerified) {
    console.warn(`Попытка входа пользователя с неподтвержденным email: ${email}`);
    // Можно добавить логику для повторной отправки подтверждения
  }

  console.log('Password verified, generating JWT...');
  // Возвращаем пользователя без пароля и токен
  const { password: _, ...userWithoutPassword } = user;
  const token = generateJWT(user);
  
  console.log('Login successful for user:', user.email);
  return {
    user: userWithoutPassword,
    token,
  };
} 