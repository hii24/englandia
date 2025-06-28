const { MongoClient } = require('mongodb');

async function testLockDebug() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eng-landia';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Подключение к MongoDB успешно');
    
    const db = client.db();
    
    // 1. Проверяем структуру коллекции progress
    console.log('\n📊 Проверяем структуру коллекции progress...');
    const progressCollection = db.collection('studentprogresses');
    const progressCount = await progressCollection.countDocuments();
    console.log(`Всего записей в progress: ${progressCount}`);
    
    if (progressCount > 0) {
      const sampleProgress = await progressCollection.findOne();
      console.log('Пример записи progress:', JSON.stringify(sampleProgress, null, 2));
    }
    
    // 2. Проверяем структуру коллекции lessons
    console.log('\n📚 Проверяем структуру коллекции lessons...');
    const lessonsCollection = db.collection('lessons');
    const lessonsCount = await lessonsCollection.countDocuments();
    console.log(`Всего уроков: ${lessonsCount}`);
    
    if (lessonsCount > 0) {
      const sampleLesson = await lessonsCollection.findOne();
      console.log('Пример урока:', JSON.stringify(sampleLesson, null, 2));
    }
    
    // 3. Проверяем структуру коллекции users
    console.log('\n👥 Проверяем структуру коллекции users...');
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    console.log(`Всего пользователей: ${usersCount}`);
    
    const students = await usersCollection.find({ role: 'student' }).toArray();
    const teachers = await usersCollection.find({ role: 'teacher' }).toArray();
    console.log(`Студентов: ${students.length}, Учителей: ${teachers.length}`);
    
    if (students.length > 0 && teachers.length > 0 && lessonsCount > 0) {
      const studentId = students[0]._id.toString();
      const teacherId = teachers[0]._id.toString();
      const lessonId = (await lessonsCollection.findOne())._id.toString();
      
      console.log('\n🔍 Тестируем API блокировки...');
      console.log(`Студент: ${studentId}`);
      console.log(`Учитель: ${teacherId}`);
      console.log(`Урок: ${lessonId}`);
      
      // 4. Тестируем GET запрос
      console.log('\n📡 Тестируем GET /api/progress/student-lesson...');
      const getResponse = await fetch(`http://localhost:3000/api/progress/student-lesson?studentId=${studentId}&lessonId=${lessonId}`);
      console.log(`GET статус: ${getResponse.status}`);
      
      if (getResponse.ok) {
        const getData = await getResponse.json();
        console.log('GET ответ:', JSON.stringify(getData, null, 2));
      } else {
        console.log('GET ошибка:', await getResponse.text());
      }
      
      // 5. Тестируем PUT запрос для блокировки
      console.log('\n🔒 Тестируем PUT /api/progress/student-lesson (блокировка)...');
      const putResponse = await fetch(`http://localhost:3000/api/progress/student-lesson`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentId,
          lessonId: lessonId,
          isLocked: true
        })
      });
      console.log(`PUT статус: ${putResponse.status}`);
      
      if (putResponse.ok) {
        const putData = await putResponse.json();
        console.log('PUT ответ:', JSON.stringify(putData, null, 2));
      } else {
        console.log('PUT ошибка:', await putResponse.text());
      }
      
      // 6. Проверяем результат в базе
      console.log('\n💾 Проверяем результат в базе данных...');
      const updatedProgress = await progressCollection.findOne({
        studentId: new require('mongodb').ObjectId(studentId),
        lessonId: new require('mongodb').ObjectId(lessonId)
      });
      
      if (updatedProgress) {
        console.log('Обновленная запись progress:', JSON.stringify(updatedProgress, null, 2));
      } else {
        console.log('Запись progress не найдена после обновления');
      }
      
      // 7. Тестируем GET запрос после блокировки
      console.log('\n📡 Тестируем GET после блокировки...');
      const getAfterResponse = await fetch(`http://localhost:3000/api/progress/student-lesson?studentId=${studentId}&lessonId=${lessonId}`);
      console.log(`GET после блокировки статус: ${getAfterResponse.status}`);
      
      if (getAfterResponse.ok) {
        const getAfterData = await getAfterResponse.json();
        console.log('GET после блокировки ответ:', JSON.stringify(getAfterData, null, 2));
      } else {
        console.log('GET после блокировки ошибка:', await getAfterResponse.text());
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.close();
  }
}

testLockDebug(); 