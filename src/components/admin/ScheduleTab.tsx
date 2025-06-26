import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { getLessonSchedule, updateLessonSchedule } from '@/lib/api';

export const ScheduleTab: React.FC = () => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const [scheduleData, setScheduleData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  useEffect(() => {
    // Загружаем расписание для всех уроков
    lessons.forEach((lesson: any) => {
      loadLessonSchedule(lesson._id);
    });
  }, [lessons]);

  const loadLessonSchedule = async (lessonId: string) => {
    try {
      const data = await getLessonSchedule(lessonId);
      setScheduleData(prev => ({ ...prev, [lessonId]: data }));
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    }
  };

  const handleScheduleUpdate = async (lessonId: string, field: string, value: any) => {
    setLoading(prev => ({ ...prev, [lessonId]: true }));
    
    try {
      const currentData = scheduleData[lessonId] || {};
      const newData = { ...currentData, [field]: value };
      
      await updateLessonSchedule(lessonId, newData);
      setScheduleData(prev => ({ ...prev, [lessonId]: newData }));
    } catch (error) {
      console.error('Ошибка обновления расписания:', error);
      alert('Ошибка обновления расписания');
    } finally {
      setLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const calculateNextDates = (pattern: string, startDate: string) => {
    if (!startDate) return [];
    
    const dates = [];
    const start = new Date(startDate);
    const is4PerMonth = pattern === '4_per_month';
    const interval = is4PerMonth ? 7 : 3.5; // 4 раза в месяц = каждую неделю, 8 раз = каждые 3.5 дня
    
    for (let i = 0; i < 12; i++) { // Показываем следующие 12 уроков
      const nextDate = new Date(start);
      nextDate.setDate(start.getDate() + (i * interval));
      dates.push(nextDate.toLocaleDateString('ru-RU'));
    }
    
    return dates;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Управление расписанием уроков</h3>
        <p className="text-gray-600">
          Настройте расписание для каждого урока. Система автоматически рассчитает даты на основе выбранного паттерна.
        </p>
      </div>

      <div className="grid gap-6">
        {lessons.map((lesson: any) => {
          const lessonSchedule = scheduleData[lesson._id] || {};
          const nextDates = calculateNextDates(
            lessonSchedule.schedulePattern || '4_per_month',
            lessonSchedule.scheduledDate
          );

          return (
            <div key={lesson._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold">Урок {lesson.orderNumber}: {lesson.title}</h4>
                  <p className="text-gray-600 text-sm">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={lessonSchedule.scheduleEnabled || false}
                      onChange={(e) => handleScheduleUpdate(lesson._id, 'scheduleEnabled', e.target.checked)}
                      className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    />
                    <span className="text-sm font-medium">Включить расписание</span>
                  </label>
                </div>
              </div>

              {lessonSchedule.scheduleEnabled && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дата первого урока
                      </label>
                      <input
                        type="datetime-local"
                        value={lessonSchedule.scheduledDate ? lessonSchedule.scheduledDate.slice(0, 16) : ''}
                        onChange={(e) => handleScheduleUpdate(lesson._id, 'scheduledDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Частота уроков
                      </label>
                      <select
                        value={lessonSchedule.schedulePattern || '4_per_month'}
                        onChange={(e) => handleScheduleUpdate(lesson._id, 'schedulePattern', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        <option value="4_per_month">4 раза в месяц (еженедельно)</option>
                        <option value="8_per_month">8 раз в месяц (2 раза в неделю)</option>
                      </select>
                    </div>

                    {loading[lesson._id] && (
                      <div className="text-sm text-gray-500">Сохранение...</div>
                    )}
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Предварительные даты уроков:</h5>
                    <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                      {nextDates.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                          {nextDates.map((date, index) => (
                            <li key={index} className="flex justify-between">
                              <span>Урок {lesson.orderNumber + index}:</span>
                              <span className="font-medium">{date}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">Укажите дату первого урока для просмотра расписания</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Информация о расписании:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>4 раза в месяц:</strong> уроки проводятся еженедельно</li>
          <li>• <strong>8 раз в месяц:</strong> уроки проводятся 2 раза в неделю</li>
          <li>• Система автоматически рассчитывает даты на основе выбранного паттерна</li>
          <li>• Учителя смогут отмечать посещения в соответствии с расписанием</li>
        </ul>
      </div>
    </div>
  );
}; 