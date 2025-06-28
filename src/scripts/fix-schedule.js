// Мини-скрипт для диагностики и исправления расписания
// Запуск: node src/scripts/fix-schedule.js

const https = require('https');
const http = require('http');

class ScheduleFixer {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  log(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    this.results.push({ timestamp, message, data });
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 3000),
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      if (options.body) {
        requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
      }

      const req = client.request(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ status: res.statusCode, data: jsonData });
          } catch (e) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });

      req.on('error', reject);
      
      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }

  async checkStorage() {
    this.log('🔍 Проверяем хранилище расписаний...');
    
    try {
      const response = await this.makeRequest('/api/debug/schedule-storage');
      
      if (response.status === 200) {
        this.log('✅ Хранилище доступно', response.data);
        return response.data;
      } else {
        this.log('❌ Ошибка доступа к хранилищу', response);
        return null;
      }
    } catch (error) {
      this.log('❌ Ошибка при проверке хранилища', error.message);
      return null;
    }
  }

  async getLessons() {
    this.log('📚 Получаем список уроков...');
    
    try {
      const response = await this.makeRequest('/api/lessons');
      
      if (response.status === 200) {
        this.log(`✅ Найдено ${response.data.length} уроков`);
        return response.data;
      } else {
        this.log('❌ Ошибка получения уроков', response);
        return [];
      }
    } catch (error) {
      this.log('❌ Ошибка при получении уроков', error.message);
      return [];
    }
  }

  async createTeacherSchedule(teacherId, studentId) {
    this.log(`👨‍🏫 Создаем расписание учителя ${teacherId} для ученика ${studentId}...`);
    
    const scheduleData = {
      teacherId,
      studentId,
      enabled: true,
      daysSchedule: [
        { day: 'monday', time: '18:00', enabled: true },
        { day: 'wednesday', time: '19:00', enabled: true },
        { day: 'friday', time: '17:00', enabled: false },
        { day: 'saturday', time: '10:00', enabled: false },
        { day: 'sunday', time: '10:00', enabled: false },
        { day: 'tuesday', time: '18:00', enabled: false },
        { day: 'thursday', time: '18:00', enabled: false }
      ],
      timezone: 'Europe/Moscow'
    };

    try {
      const response = await this.makeRequest('/api/schedule/teacher', {
        method: 'POST',
        body: JSON.stringify(scheduleData)
      });

      if (response.status === 200) {
        this.log('✅ Расписание учителя создано', response.data);
        return true;
      } else {
        this.log('❌ Ошибка создания расписания учителя', response);
        return false;
      }
    } catch (error) {
      this.log('❌ Ошибка при создании расписания учителя', error.message);
      return false;
    }
  }

  async autoScheduleLessons(teacherId, studentId) {
    this.log(`📅 Автоматически назначаем уроки...`);
    
    const autoScheduleData = {
      startDate: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await this.makeRequest(`/api/lessons/auto-schedule?studentId=${studentId}&teacherId=${teacherId}`, {
        method: 'POST',
        body: JSON.stringify(autoScheduleData)
      });

      if (response.status === 200) {
        this.log(`✅ Назначено ${response.data.scheduledCount} из ${response.data.totalLessons} доступных уроков`, response.data);
        return response.data.scheduledLessons;
      } else {
        this.log('❌ Ошибка автоматического назначения', response);
        return [];
      }
    } catch (error) {
      this.log('❌ Ошибка при автоматическом назначении', error.message);
      return [];
    }
  }

  async testLessonSchedule(lessonId, studentId, teacherId) {
    this.log(`🔍 Тестируем расписание для урока ${lessonId}...`);
    
    try {
      const response = await this.makeRequest(`/api/lessons/schedule?lessonId=${lessonId}&studentId=${studentId}&teacherId=${teacherId}`);
      
      if (response.status === 200) {
        this.log('✅ Расписание урока получено', response.data);
        return response.data;
      } else {
        this.log('❌ Ошибка получения расписания урока', response);
        return null;
      }
    } catch (error) {
      this.log('❌ Ошибка при получении расписания урока', error.message);
      return null;
    }
  }

  async runFullDiagnostic() {
    console.log('🚀 Запуск полной диагностики расписания...\n');

    // 1. Проверяем хранилище
    const storage = await this.checkStorage();
    if (!storage) {
      this.log('❌ Диагностика прервана: хранилище недоступно');
      return;
    }

    // 2. Получаем уроки
    const lessons = await this.getLessons();
    if (lessons.length === 0) {
      this.log('❌ Диагностика прервана: нет уроков');
      return;
    }

    // 3. Тестовые данные
    const teacherId = '685d67e3d5e671c77b9fe8b5';
    const studentId = '685d6819d5e671c77b9fe8ba';

    // 4. Создаем расписание учителя
    const teacherScheduleCreated = await this.createTeacherSchedule(teacherId, studentId);
    if (!teacherScheduleCreated) {
      this.log('❌ Диагностика прервана: не удалось создать расписание учителя');
      return;
    }

    // 5. Автоматически назначаем уроки
    const scheduledLessons = await this.autoScheduleLessons(teacherId, studentId);
    if (scheduledLessons.length === 0) {
      this.log('❌ Диагностика прервана: не удалось назначить уроки');
      return;
    }

    // 6. Тестируем каждый назначенный урок
    this.log('\n🔍 Тестируем назначенные уроки...');
    for (const scheduledLesson of scheduledLessons) {
      await this.testLessonSchedule(scheduledLesson.lessonId, studentId, teacherId);
    }

    // 7. Финальная проверка хранилища
    this.log('\n📊 Финальная проверка хранилища...');
    const finalStorage = await this.checkStorage();

    // 8. Вывод результатов
    this.log('\n📋 РЕЗУЛЬТАТЫ ДИАГНОСТИКИ:');
    this.log(`✅ Уроков в системе: ${lessons.length}`);
    this.log(`✅ Назначено уроков: ${scheduledLessons.length}`);
    this.log(`✅ Расписаний учителей: ${finalStorage.storage.teacherSchedulesCount}`);
    this.log(`✅ Расписаний уроков: ${finalStorage.storage.lessonSchedulesCount}`);

    if (scheduledLessons.length > 0 && finalStorage.storage.lessonSchedulesCount > 0) {
      this.log('🎉 Диагностика завершена успешно! Расписание должно работать.');
    } else {
      this.log('⚠️ Диагностика завершена с предупреждениями. Проверьте логи выше.');
    }
  }

  async quickFix() {
    console.log('🔧 Быстрое исправление расписания...\n');

    // Очищаем хранилище
    this.log('🗑️ Очищаем старое хранилище...');
    try {
      await this.makeRequest('/api/debug/schedule-storage', { method: 'DELETE' });
      this.log('✅ Хранилище очищено');
    } catch (error) {
      this.log('⚠️ Не удалось очистить хранилище (продолжаем)');
    }

    // Запускаем полную диагностику
    await this.runFullDiagnostic();
  }
}

// Запуск скрипта
async function main() {
  const fixer = new ScheduleFixer();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--quick-fix')) {
    await fixer.quickFix();
  } else {
    await fixer.runFullDiagnostic();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ScheduleFixer; 