import { MongoClient } from 'mongodb';
import type { RegistrationData } from '@/types/registration';

const uri = process.env.MONGODB_URI || '';
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

export async function saveRegistration(data: RegistrationData) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection('registrations');
  await collection.insertOne(data);
  return data;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
} 