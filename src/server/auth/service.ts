import { findUserByEmail } from '../db';
import { verifyPassword } from '../registration/utils';
import type { User } from '@/types/registration';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
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
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function handleLogin(email: string, password: string): Promise<LoginResult> {
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

  // Поиск пользователя по email
  const user = await findUserByEmail(email.toLowerCase());
  
  if (!user) {
    const error = new Error('Пользователь с таким email не найден');
    (error as any).name = 'AuthError';
    throw error;
  }

  // Проверка пароля
  const isPasswordValid = await verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
    const error = new Error('Неверный пароль');
    (error as any).name = 'AuthError';
    throw error;
  }

  // Проверка, что email подтвержден (опционально)
  if (!user.isEmailVerified) {
    console.warn(`Попытка входа пользователя с неподтвержденным email: ${email}`);
    // Можно добавить логику для повторной отправки подтверждения
  }

  // Возвращаем пользователя без пароля и токен
  const { password: _, ...userWithoutPassword } = user;
  const token = generateJWT(user);
  
  return {
    user: userWithoutPassword,
    token,
  };
} 