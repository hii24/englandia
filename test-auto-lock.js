const { MongoClient } = require('mongodb');

async function testAutoLock() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eng-landia';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Подключение к MongoDB успешно');
    
    const db = client.db();
    
    // Проверяем уроки
    console.log('\n📚 Проверяем уроки...');
    const lessonsCollection = db.collection('lessons');
    const lessons = await lessonsCollection.find({ isActive: true }).sort({ orderNumber: 1 }).toArray();
    console.log(`Найдено уроков: ${lessons.length}`);
    
    lessons.forEach(lesson => {
      console.log(`- Урок ${lesson.orderNumber}: ${lesson.title} (ID: ${lesson._id})`);
    });
    
    // Проверяем прогресс
    console.log('\n📊 Проверяем прогресс...');
    const progressCollection = db.collection('studentprogresses');
    const progressRecords = await progressCollection.find().toArray();
    console.log(`Найдено записей прогресса: ${progressRecords.length}`);
    
    if (progressRecords.length > 0) {
      const sampleProgress = progressRecords[0];
      console.log('Пример записи прогресса:', {
        studentId: sampleProgress.studentId,
        lessonId: sampleProgress.lessonId,
        attended: sampleProgress.attended,
        status: sampleProgress.status,
        hasIsLocked: 'isLocked' in sampleProgress
      });
    }
    
    // Тестируем API автоматической блокировки
    if (lessons.length >= 2 && progressRecords.length > 0) {
      const studentId = progressRecords[0].studentId.toString();
      const lesson1Id = lessons[0]._id.toString();
      const lesson2Id = lessons[1]._id.toString();
      
      console.log('\n🔍 Тестируем автоматическую блокировку...');
      console.log(`Студент: ${studentId}`);
      console.log(`Урок 1: ${lesson1Id}`);
      console.log(`Урок 2: ${lesson2Id}`);
      
      // Тестируем первый урок (должен быть разблокирован)
      console.log('\n📡 Тестируем Урок 1 (должен быть разблокирован)...');
      const response1 = await fetch(`http://localhost:3000/api/progress/student-lesson?studentId=${studentId}&lessonId=${lesson1Id}`);
      
      if (response1.ok) {
        const data1 = await response1.json();
        console.log('Урок 1 результат:', {
          isLocked: data1.isLocked,
          attended: data1.attended,
          status: data1.status
        });
      } else {
        console.log('Ошибка Урока 1:', await response1.text());
      }
      
      // Тестируем второй урок (должен быть заблокирован, если первый не посещен)
      console.log('\n📡 Тестируем Урок 2 (должен быть заблокирован)...');
      const response2 = await fetch(`http://localhost:3000/api/progress/student-lesson?studentId=${studentId}&lessonId=${lesson2Id}`);
      
      if (response2.ok) {
        const data2 = await response2.json();
        console.log('Урок 2 результат:', {
          isLocked: data2.isLocked,
          attended: data2.attended,
          status: data2.status
        });
      } else {
        console.log('Ошибка Урока 2:', await response2.text());
      }
      
      // Отмечаем посещение первого урока
      console.log('\n✅ Отмечаем посещение Урока 1...');
      const markAttendanceResponse = await fetch(`http://localhost:3000/api/progress/student-lesson`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentId,
          lessonId: lesson1Id,
          attended: true,
          attendanceDate: new Date().toISOString()
        })
      });
      
      if (markAttendanceResponse.ok) {
        console.log('✅ Посещение отмечено успешно');
        
        // Проверяем второй урок снова (теперь должен быть разблокирован)
        console.log('\n📡 Проверяем Урок 2 после посещения Урока 1...');
        const response2After = await fetch(`http://localhost:3000/api/progress/student-lesson?studentId=${studentId}&lessonId=${lesson2Id}`);
        
        if (response2After.ok) {
          const data2After = await response2After.json();
          console.log('Урок 2 после посещения Урока 1:', {
            isLocked: data2After.isLocked,
            attended: data2After.attended,
            status: data2After.status
          });
        } else {
          console.log('Ошибка проверки Урока 2 после посещения:', await response2After.text());
        }
      } else {
        console.log('❌ Ошибка отметки посещения:', await markAttendanceResponse.text());
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.close();
  }
}

testAutoLock(); 