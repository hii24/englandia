const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const FROM_DB = 'test';
const TO_DB = 'englandia';

async function migrateCollections() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const fromDb = client.db(FROM_DB);
    const toDb = client.db(TO_DB);

    const collections = await fromDb.listCollections().toArray();
    console.log(`🔍 Found collections in '${FROM_DB}':`, collections.map(c => c.name));

    for (const { name } of collections) {
      const docs = await fromDb.collection(name).find({}).toArray();
      if (docs.length === 0) {
        console.log(`ℹ️ Collection '${name}' is empty, skipping.`);
        continue;
      }
      // Вставляем документы в целевую коллекцию
      const result = await toDb.collection(name).insertMany(docs);
      console.log(`✅ Migrated ${result.insertedCount} documents to '${TO_DB}.${name}'`);
    }

    console.log('🎉 Migration completed!');
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

migrateCollections(); 