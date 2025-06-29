import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'englandia';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Test createUser: Starting...');
    
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('users');
    
    console.log('🔍 Test createUser: Connected to database');
    
    const testData = {
      firstName: 'Test',
      lastName: 'Teacher',
      email: `testteacher${Date.now()}@example.com`,
      role: 'teacher' as const,
      phone: '', // Пустой телефон
      age: 25
    };

    console.log('🔍 Test createUser: Test data:', testData);
    
    // Проверяем, существует ли пользователь с таким email
    console.log('🔍 Test createUser: Checking email uniqueness...');
    const existingByEmail = await collection.findOne({ email: testData.email.toLowerCase() });
    if (existingByEmail) {
      console.log('❌ Test createUser: Email already exists');
      return res.status(400).json({ error: 'Пользователь с таким email уже зарегистрирован' });
    }
    console.log('✅ Test createUser: Email is unique');

    // Проверяем уникальность телефона только если он не пустой
    console.log('🔍 Test createUser: Checking phone uniqueness...');
    if (testData.phone && testData.phone.trim() !== '') {
      const existingByPhone = await collection.findOne({ phone: testData.phone });
      if (existingByPhone) {
        console.log('❌ Test createUser: Phone already exists');
        return res.status(400).json({ error: 'Пользователь с таким телефоном уже зарегистрирован' });
      }
    } else {
      console.log('✅ Test createUser: Phone is empty, skipping uniqueness check');
    }

    console.log('✅ Test createUser: Phone check passed');

    const now = new Date();
    const user = {
      _id: new ObjectId(),
      ...testData,
      email: testData.email.toLowerCase(),
      phone: testData.phone || '',
      age: testData.age || 0,
      role: testData.role || 'guest',
      isEmailVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    console.log('🔍 Test createUser: Inserting user...');
    await collection.insertOne(user);
    console.log('✅ Test createUser: User inserted successfully');

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('❌ Test createUser failed:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
} 