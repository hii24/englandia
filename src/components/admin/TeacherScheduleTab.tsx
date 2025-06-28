import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

interface TeacherScheduleTabProps {
  selectedStudent?: any;
}

interface DaySchedule {
  day: string;
  time: string;
  enabled: boolean;
}

interface ScheduleSettings {
  enabled: boolean;
  daysSchedule: DaySchedule[];
  timezone: string;
}

export const TeacherScheduleTab: React.FC<TeacherScheduleTabProps> = ({ selectedStudent }) => {
  const user = useUserStore(s => s.user);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    enabled: false,
    daysSchedule: [
      { day: 'monday', time: '18:00', enabled: false },
      { day: 'tuesday', time: '18:00', enabled: false },
      { day: 'wednesday', time: '18:00', enabled: false },
      { day: 'thursday', time: '18:00', enabled: false },
      { day: 'friday', time: '18:00', enabled: false },
      { day: 'saturday', time: '18:00', enabled: false },
      { day: 'sunday', time: '18:00', enabled: false }
    ],
    timezone: 'Europe/Moscow'
  });
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentSchedule, setSelectedStudentSchedule] = useState<any>(null);

  const daysOfWeek = [
    { value: 'monday', label: 'Понедельник' },
    { value: 'tuesday', label: 'Вторник' },
    { value: 'wednesday', label: 'Среда' },
    { value: 'thursday', label: 'Четверг' },
    { value: 'friday', label: 'Пятница' },
    { value: 'saturday', label: 'Суббота' },
    { value: 'sunday', label: 'Воскресенье' }
  ];

  useEffect(() => {
    if (user?.role === 'teacher' && user?._id) {
      loadStudents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentSchedule(selectedStudent._id);
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      const response = await fetch(`/api/users?role=student,guest&teacherId=${user?._id}`);
      const studentsData = await response.json();
      setStudents(studentsData);
    } catch (error) {
      console.error('Ошибка загрузки учеников:', error);
    }
  };

  const loadStudentSchedule = async (studentId: string) => {
    try {
      const response = await fetch(`/api/schedule/teacher?studentId=${studentId}&teacherId=${user?._id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedStudentSchedule(data);
        setScheduleSettings({
          enabled: data.enabled || false,
          daysSchedule: data.daysSchedule || scheduleSettings.daysSchedule,
          timezone: data.timezone || 'Europe/Moscow'
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    }
  };

  const handleScheduleUpdate = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/schedule/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          teacherId: user?._id,
          ...scheduleSettings
        })
      });

      if (response.ok) {
        alert('Расписание обновлено успешно!');
        await loadStudentSchedule(selectedStudent._id);
        
        // Если расписание включено, предлагаем автоматически назначить даты уроков
        if (scheduleSettings.enabled && scheduleSettings.daysSchedule.some(day => day.enabled)) {
          const shouldAutoSchedule = confirm(
            'Хотите автоматически назначить даты для уроков на основе этого расписания?'
          );
          
          if (shouldAutoSchedule) {
            await handleAutoScheduleLessons();
          }
        }
      } else {
        const errorData = await response.json();
        alert(`Ошибка обновления расписания: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Ошибка обновления расписания:', error);
      alert('Ошибка обновления расписания');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoScheduleLessons = async () => {
    if (!selectedStudent || !user?._id) return;
    
    try {
      const response = await fetch(`/api/lessons/auto-schedule?studentId=${selectedStudent._id}&teacherId=${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date().toISOString().split('T')[0],
          lessonsCount: 4 // По умолчанию 4 урока
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Автоматически назначено ${data.scheduledLessons.length} уроков на основе расписания!`);
      } else {
        const errorData = await response.json();
        alert(`Ошибка автоматического назначения: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error auto-scheduling lessons:', error);
      alert('Ошибка автоматического назначения уроков');
    }
  };

  const handleDayToggle = (day: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      daysSchedule: prev.daysSchedule.map(d => 
        d.day === day ? { ...d, enabled: !d.enabled } : d
      )
    }));
  };

  const handleTimeChange = (day: string, time: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      daysSchedule: prev.daysSchedule.map(d => 
        d.day === day ? { ...d, time } : d
      )
    }));
  };

  const getStudentSubscription = (student: any): string => {
    // Определяем тариф на основе роли или других данных
    if (student.role === 'guest') return 'Нет подписки';
    // Здесь можно добавить логику определения тарифа из базы данных
    return '4 урока/мес'; // По умолчанию
  };

  const calculateScheduleInfo = () => {
    if (!scheduleSettings.enabled) {
      return null;
    }

    const enabledDays = scheduleSettings.daysSchedule.filter(d => d.enabled);
    if (enabledDays.length === 0) {
      return null;
    }

    const subscription = getStudentSubscription(selectedStudent);
    const isIntensive = subscription === '8 уроков/мес';
    
    return {
      daysCount: enabledDays.length,
      isIntensive,
      enabledDays
    };
  };

  if (!selectedStudent) {
    return (
      <div className="teacher-schedule-container">
        <div className="no-student-selected">
          <h4>Выберите ученика</h4>
          <p>Для настройки расписания сначала выберите ученика из списка</p>
        </div>
      </div>
    );
  }

  const scheduleInfo = calculateScheduleInfo();

  return (
    <div className="teacher-schedule-container">
      <div className="schedule-header">
        <p className="schedule-subtitle">
          Тариф: <strong>{getStudentSubscription(selectedStudent)}</strong>
        </p>
      </div>

      <div className="schedule-content">
        <div className="schedule-settings-card">
          <div className="settings-header">
            <h4>Настройки расписания</h4>
            <label className="enable-toggle">
              <input
                type="checkbox"
                checked={scheduleSettings.enabled}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                className="toggle-checkbox"
              />
              <span className="toggle-text">Включить расписание</span>
            </label>
          </div>

          {scheduleSettings.enabled && (
            <div className="settings-form">
              <div className="form-section">
                <h5>Дни недели и время занятий</h5>
                <div className="days-schedule-grid">
                  {scheduleSettings.daysSchedule.map(daySchedule => {
                    const dayInfo = daysOfWeek.find(d => d.value === daySchedule.day);
                    return (
                      <div key={daySchedule.day} className="day-schedule-item">
                        <div className="day-header">
                          <label className="day-checkbox">
                            <input
                              type="checkbox"
                              checked={daySchedule.enabled}
                              onChange={() => handleDayToggle(daySchedule.day)}
                              className="day-input"
                            />
                            <span className="day-label">{dayInfo?.label}</span>
                          </label>
                        </div>
                        {daySchedule.enabled && (
                          <div className="day-time-input">
                            <input
                              type="time"
                              value={daySchedule.time}
                              onChange={(e) => handleTimeChange(daySchedule.day, e.target.value)}
                              className="time-input"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-section">
                <h5>Часовой пояс</h5>
                <div className="timezone-input-group">
                  <select
                    value={scheduleSettings.timezone}
                    onChange={(e) => setScheduleSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="timezone-select"
                  >
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/Kiev">Киев (UTC+2)</option>
                    <option value="Europe/London">Лондон (UTC+0)</option>
                    <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  onClick={handleScheduleUpdate}
                  disabled={loading || !scheduleSettings.daysSchedule.some(d => d.enabled)}
                  className="save-button"
                >
                  {loading ? 'Сохранение...' : 'Сохранить расписание'}
                </button>
              </div>
            </div>
          )}
        </div>

        {scheduleInfo && (
          <div className="schedule-preview-card">
            <h4>Предварительный просмотр</h4>
            <div className="preview-content">
              <div className="preview-item">
                <span className="preview-label">Количество дней:</span>
                <span className="preview-value">{scheduleInfo.daysCount}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Часовой пояс:</span>
                <span className="preview-value">{scheduleSettings.timezone}</span>
              </div>
              <div className="preview-schedule">
                <h5>Расписание по дням:</h5>
                <div className="schedule-days-list">
                  {scheduleInfo.enabledDays.map(day => {
                    const dayInfo = daysOfWeek.find(d => d.value === day.day);
                    return (
                      <div key={day.day} className="schedule-day-item">
                        <span className="day-name">{dayInfo?.label}:</span>
                        <span className="day-time">{day.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div className="info-panel">
        <h4>Информация о расписании</h4>
        <ul>
          <li>• Выберите дни недели для проведения занятий</li>
          <li>• Установите разное время для каждого дня</li>
          <li>• Система автоматически учтет тариф ученика</li>
          <li>• Расписание будет применяться ко всем урокам ученика</li>
        </ul>
      </div> */}

      <style jsx>{`
        .teacher-schedule-container {
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
        .schedule-subtitle {
          color: #64748b;
          margin: 4px 0;
        }
        .schedule-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }
        .schedule-settings-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .settings-header h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }
        .enable-toggle {
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
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-section h5 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }
        .days-schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .day-schedule-item {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }
        .day-schedule-item:hover {
          border-color: #7c3aed;
          box-shadow: 0 2px 4px rgba(124, 58, 237, 0.1);
        }
        .day-header {
          margin-bottom: 12px;
        }
        .day-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .day-input {
          width: 16px;
          height: 16px;
          accent-color: #7c3aed;
        }
        .day-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }
        .day-time-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .time-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          transition: all 0.2s;
          flex: 1;
        }
        .time-input:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .timezone-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .timezone-select {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s;
        }
        .timezone-select:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .form-actions {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .save-button {
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-button:hover:not(:disabled) {
          background: #6d28d9;
        }
        .save-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .schedule-preview-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }
        .schedule-preview-card h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }
        .preview-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .preview-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .preview-label {
          font-weight: 500;
          color: #64748b;
        }
        .preview-value {
          font-weight: 600;
          color: #1e293b;
        }
        .preview-schedule h5 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }
        .schedule-days-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .schedule-day-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
        }
        .day-name {
          font-weight: 500;
          color: #64748b;
        }
        .day-time {
          font-weight: 600;
          color: #1e293b;
        }
        .info-panel {
          margin-top: 20px;
          padding: 16px;
          background: #eff6ff;
          border-radius: 8px;
          border: 1px solid #bfdbfe;
        }
        .info-panel h4 {
          font-weight: 600;
          color: #1e40af;
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        .info-panel ul {
          margin: 0;
          padding-left: 16px;
          font-size: 13px;
          color: #1e40af;
        }
        .info-panel li {
          margin-bottom: 4px;
        }
        .no-student-selected {
          text-align: center;
          color: #64748b;
          padding: 40px 20px;
        }
        .no-student-selected h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        @media (max-width: 768px) {
          .days-schedule-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}; 