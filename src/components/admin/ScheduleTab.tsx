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
    <div className="schedule-container">
      <div className="schedule-header">
        <h3 className="schedule-title">Управление расписанием уроков</h3>
        <p className="schedule-description">
          Настройте расписание для каждого урока. Система автоматически рассчитает даты на основе выбранного паттерна.
        </p>
      </div>

      <div className="schedule-content">
        <div className="lessons-grid">
          {lessons.map((lesson: any) => {
            const lessonSchedule = scheduleData[lesson._id] || {};
            const nextDates = calculateNextDates(
              lessonSchedule.schedulePattern || '4_per_month',
              lessonSchedule.scheduledDate
            );

            return (
              <div key={lesson._id} className="lesson-schedule-card">
                <div className="lesson-header">
                  <div className="lesson-info">
                    <h4 className="lesson-title">Урок {lesson.orderNumber}: {lesson.title}</h4>
                    <p className="lesson-description">{lesson.description}</p>
                  </div>
                  <div className="schedule-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={lessonSchedule.scheduleEnabled || false}
                        onChange={(e) => handleScheduleUpdate(lesson._id, 'scheduleEnabled', e.target.checked)}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-text">Включить расписание</span>
                    </label>
                  </div>
                </div>

                {lessonSchedule.scheduleEnabled && (
                  <div className="schedule-settings">
                    <div className="settings-column">
                      <div className="form-group">
                        <label className="form-label">Дата первого урока</label>
                        <input
                          type="datetime-local"
                          value={lessonSchedule.scheduledDate ? lessonSchedule.scheduledDate.slice(0, 16) : ''}
                          onChange={(e) => handleScheduleUpdate(lesson._id, 'scheduledDate', e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Частота уроков</label>
                        <select
                          value={lessonSchedule.schedulePattern || '4_per_month'}
                          onChange={(e) => handleScheduleUpdate(lesson._id, 'schedulePattern', e.target.value)}
                          className="form-select"
                        >
                          <option value="4_per_month">4 раза в месяц (еженедельно)</option>
                          <option value="8_per_month">8 раз в месяц (2 раза в неделю)</option>
                        </select>
                      </div>

                      {loading[lesson._id] && (
                        <div className="loading-indicator">
                          <span className="loading-spinner"></span>
                          Сохранение...
                        </div>
                      )}
                    </div>

                    <div className="dates-column">
                      <h5 className="dates-title">Предварительные даты уроков:</h5>
                      <div className="dates-list">
                        {nextDates.length > 0 ? (
                          <ul className="dates-items">
                            {nextDates.map((date, index) => (
                              <li key={index} className="date-item">
                                <span className="date-lesson">Урок {lesson.orderNumber + index}:</span>
                                <span className="date-value">{date}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-dates">Укажите дату первого урока для просмотра расписания</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="info-panel">
        <h4 className="info-title">Информация о расписании:</h4>
        <ul className="info-list">
          <li>• <strong>4 раза в месяц:</strong> уроки проводятся еженедельно</li>
          <li>• <strong>8 раз в месяц:</strong> уроки проводятся 2 раза в неделю</li>
          <li>• Система автоматически рассчитывает даты на основе выбранного паттерна</li>
          <li>• Учителя смогут отмечать посещения в соответствии с расписанием</li>
        </ul>
      </div>

      <style jsx>{`
        .schedule-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        .schedule-header {
          margin-bottom: 24px;
        }
        .schedule-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }
        .schedule-description {
          color: #64748b;
          margin: 0;
        }
        .schedule-content {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }
        .lessons-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .lesson-schedule-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .lesson-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .lesson-info {
          flex: 1;
        }
        .lesson-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }
        .lesson-description {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        .schedule-toggle {
          margin-left: 20px;
        }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .toggle-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #7c3aed;
        }
        .toggle-text {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .schedule-settings {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .settings-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .form-input, .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s;
        }
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .loading-indicator {
          font-size: 14px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #7c3aed;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dates-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .dates-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin: 0;
        }
        .dates-list {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          max-height: 200px;
          overflow-y: auto;
        }
        .dates-items {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .date-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13px;
          color: #374151;
        }
        .date-lesson {
          color: #7c3aed;
          font-weight: 500;
        }
        .date-value {
          font-weight: 500;
          color: #1e293b;
        }
        .no-dates {
          color: #64748b;
          font-size: 13px;
          margin: 0;
        }
        .info-panel {
          margin-top: 20px;
          padding: 16px;
          background: #eff6ff;
          border-radius: 8px;
          border: 1px solid #bfdbfe;
        }
        .info-title {
          font-weight: 600;
          color: #1e40af;
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        .info-list {
          margin: 0;
          padding-left: 16px;
          font-size: 13px;
          color: #1e40af;
        }
        .info-list li {
          margin-bottom: 4px;
        }
        @media (max-width: 768px) {
          .schedule-settings {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}; 