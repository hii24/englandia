import { validateRegistration } from './validate';
import { saveRegistration } from '../db';
import type { RegistrationData } from '@/types/registration';
import { generatePassword } from './utils';

export async function handleRegistration(data: Omit<RegistrationData, 'password' | 'createdAt'>) {
  validateRegistration({ ...data, password: '' });
  const password = generatePassword();
  const registration: RegistrationData = {
    ...data,
    password,
    createdAt: new Date(),
  };
  await saveRegistration(registration);
  return { ...registration, password: undefined };
} 