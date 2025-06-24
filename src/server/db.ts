import { MongoClient, ObjectId } from 'mongodb';
import type { User, CreateUserData } from '@/types/registration';

const uri = process.env.MONGODB_URI || 'mongodb+srv://webenglandia:MM3D5gvys8ZZIwge@cluster0.g1oslk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = process.env.MONGODB_DB || 'englandia';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('MONGODB_URI не задан в переменных окружения');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function createUser(data: CreateUserData): Promise<User> {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection('users');
  
  // Проверяем, существует ли пользователь с таким email
  const existingByEmail = await collection.findOne({ email: data.email.toLowerCase() });
  if (existingByEmail) {
    const error = new Error('Пользователь с таким email уже зарегистрирован');
    (error as any).name = 'ValidationError';
    throw error;
  }

  // Проверяем, существует ли пользователь с таким телефоном
  const existingByPhone = await collection.findOne({ phone: data.phone });
  if (existingByPhone) {
    const error = new Error('Пользователь с таким телефоном уже зарегистрирован');
    (error as any).name = 'ValidationError';
    throw error;
  }

  const now = new Date();
  const user: User = {
    _id: new ObjectId(),
    ...data,
    email: data.email.toLowerCase(),
    role: 'guest',
    isEmailVerified: false,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection('users');
  return collection.findOne({ email: email.toLowerCase() }) as Promise<User | null>;
}

export async function findUserById(id: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection('users');
  return collection.findOne({ _id: new ObjectId(id) }) as Promise<User | null>;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection('users');
  
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );
  
  return result as User | null;
}

// Для обратной совместимости
export async function saveRegistration(data: any) {
  console.warn('saveRegistration is deprecated, use createUser instead');
  return createUser(data);
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
} 