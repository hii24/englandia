import { ObjectId } from 'mongodb';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  comment?: string;
}

export interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  comment?: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  isEmailVerified: boolean;
  subscription?: ObjectId;
  teacherId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData extends Omit<User, '_id' | 'password' | 'role' | 'isEmailVerified' | 'subscription' | 'teacherId' | 'createdAt' | 'updatedAt'> {
  password: string;
} 