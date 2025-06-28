const { MongoClient } = require('mongodb');

async function createSecondLesson() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eng-landia';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Подключение к MongoDB успешно');
    
    const db = client.db();
    const lessonsCollection = db.collection('lessons');
    
    // Создаем второй урок
    const secondLesson = {
      title: "Урок 2 - Продвинутый",
      description: "Второй урок курса",
      orderNumber: 2,
      videoUrl: "",
      materials: [],
      additionalMaterials: [],
      homework: [],
      lessonLink: {
        forStudent: true
      },
      isActive: true,
      isArchived: false,
      scheduleEnabled: false,
      schedulePattern: "4_per_month",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await lessonsCollection.insertOne(secondLesson);
    console.log('✅ Второй урок создан:', result.insertedId);
    
    // Проверяем все уроки
    const allLessons = await lessonsCollection.find({ isActive: true }).sort({ orderNumber: 1 }).toArray();
    console.log('\n📚 Все активные уроки:');
    allLessons.forEach(lesson => {
      console.log(`- Урок ${lesson.orderNumber}: ${lesson.title} (ID: ${lesson._id})`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.close();
  }
}

createSecondLesson(); 