const { MongoClient } = require('mongodb');

async function migrateRemoveLock() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eng-landia';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Подключение к MongoDB успешно');
    
    const db = client.db();
    const progressCollection = db.collection('studentprogresses');
    
    console.log('\n🔧 Начинаем миграцию: удаление поля isLocked...');
    
    // Удаляем поле isLocked из всех записей
    const result = await progressCollection.updateMany(
      { isLocked: { $exists: true } },
      { $unset: { isLocked: "" } }
    );
    
    console.log(`✅ Миграция завершена!`);
    console.log(`📊 Обновлено записей: ${result.modifiedCount}`);
    
    // Проверяем результат
    const remainingWithLock = await progressCollection.countDocuments({ isLocked: { $exists: true } });
    console.log(`🔍 Записей с полем isLocked осталось: ${remainingWithLock}`);
    
    if (remainingWithLock === 0) {
      console.log('✅ Все записи успешно обновлены!');
    } else {
      console.log('⚠️ Некоторые записи не были обновлены');
    }
    
  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    await client.close();
  }
}

migrateRemoveLock(); 