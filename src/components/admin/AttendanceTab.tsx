import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { updateAttendance, fetchStudentLesson } from '@/lib/api';
import { useUserStore } from '@/store/userStore';

interface AttendanceTabProps {
  selectedStudent: any;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ selectedStudent }) => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const user = useUserStore(s => s.user);

  useEffect(() => {
    if (selectedStudent) {
      loadLessons();
    }
  }, [selectedStudent, loadLessons]);

  // Загружаем существующие данные о посещениях
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!selectedStudent || !lessons.length) return;
      
      setInitialLoading(true);
      const attendance: Record<string, boolean> = {};
      
      try {
        // Загружаем данные о посещениях для каждого урока
        await Promise.all(
          lessons.map(async (lesson: any) => {
            try {
              const data = await fetchStudentLesson(selectedStudent._id, lesson._id);
              attendance[lesson._id] = data.attended || false;
            } catch (error: any) {
              // Если данные не найдены (404), это нормально - значит посещение еще не отмечалось
              if (error.response?.status === 404) {
                console.log(`Нет данных о посещении для урока ${lesson._id} - это нормально`);
                attendance[lesson._id] = false;
              } else {
                console.error(`Ошибка загрузки данных для урока ${lesson._id}:`, error);
                attendance[lesson._id] = false;
              }
            }
          })
        );
        
        setAttendanceData(attendance);
      } catch (error) {
        console.error('Ошибка загрузки данных о посещениях:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAttendanceData();
  }, [selectedStudent, lessons]);

  const handleAttendanceChange = async (lessonId: string, attended: boolean) => {
    if (!selectedStudent || !user?._id) {
      alert('Ошибка: не удалось определить ученика или учителя');
      return;
    }

    setLoading(prev => ({ ...prev, [lessonId]: true }));
    
    try {
      console.log('Отправляем данные:', {
        studentId: selectedStudent._id,
        lessonId,
        attended,
        teacherId: user._id
      });
      
      await updateAttendance(selectedStudent._id, lessonId, attended, user._id);
      setAttendanceData(prev => ({ ...prev, [lessonId]: attended }));
      
      // Если это первый урок и ученик посетил его, показываем уведомление
      if (attended && lessons.find((l: any) => l._id === lessonId)?.orderNumber === 1) {
        alert('Первый урок посещен! Можно отправить email с предложением курса.');
      }
    } catch (error) {
      console.error('Ошибка обновления посещения:', error);
      alert(`Ошибка обновления посещения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  if (!selectedStudent) {
    return (
      <div className="text-center text-gray-600 py-8">
        Сначала выберите ученика
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="text-center text-gray-600 py-8">
        Загрузка данных о посещениях...
      </div>
    );
  }

  return (
    <div className="attendance-container">
    

      <div className="attendance-content">
        <div className="table-container">
          <table className="attendance-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Урок</th>
                <th className="table-header-cell">Название</th>
                <th className="table-header-cell">Статус посещения</th>
                <th className="table-header-cell">Действия</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {lessons.map((lesson: any) => (
                <tr key={lesson._id} className="table-row">
                  <td className="table-cell lesson-number">Урок {lesson.orderNumber}</td>
                  <td className="table-cell lesson-title">{lesson.title}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${attendanceData[lesson._id] ? 'attended' : 'not-attended'}`}>
                      {attendanceData[lesson._id] ? 'Посетил' : 'Не посетил'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleAttendanceChange(lesson._id, true)}
                        disabled={loading[lesson._id]}
                        className={`action-button attend ${attendanceData[lesson._id] ? 'active' : ''}`}
                      >
                        {loading[lesson._id] ? 'Сохранение...' : 'Отметить посещение'}
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(lesson._id, false)}
                        disabled={loading[lesson._id]}
                        className={`action-button absent ${!attendanceData[lesson._id] ? 'active' : ''}`}
                      >
                        {loading[lesson._id] ? 'Сохранение...' : 'Отметить отсутствие'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="info-panel">
        <h4 className="info-title">Информация:</h4>
        <ul className="info-list">
          <li>• Отмечайте посещения учеников после каждого урока</li>
          <li>• При посещении первого урока система предложит отправить email с предложением курса</li>
          <li>• Статус посещения сохраняется автоматически</li>
        </ul>
      </div> */}

      <style jsx>{`
        .attendance-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        .attendance-header {
          margin-bottom: 24px;
        }
        .attendance-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }
        .student-info {
          color: #64748b;
          margin: 0;
        }
        .student-name {
          font-weight: 600;
          color: #1e293b;
        }
        .attendance-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .table-container {
          flex: 1;
          overflow: auto;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .attendance-table {
          width: 100%;
          border-collapse: collapse;
        }
        .table-header {
          background: #f8fafc;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .table-header-cell {
          padding: 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }
        .table-body {
          background: white;
        }
        .table-row {
          transition: background-color 0.2s;
        }
        .table-row:hover {
          background: #f8fafc;
        }
        .table-cell {
          padding: 16px;
          font-size: 14px;
          color: #1e293b;
          border-bottom: 1px solid #f1f5f9;
        }
        .lesson-number {
          font-weight: 600;
          color: #7c3aed;
        }
        .lesson-title {
          font-weight: 500;
        }
        .status-badge {
          display: inline-flex;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 20px;
        }
        .status-badge.attended {
          background: #dcfce7;
          color: #166534;
        }
        .status-badge.not-attended {
          background: #f1f5f9;
          color: #475569;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .action-button {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .action-button.attend {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .action-button.attend:hover:not(:disabled) {
          background: #22c55e;
          color: white;
          border-color: #22c55e;
        }
        .action-button.attend.active {
          background: #22c55e;
          color: white;
          border-color: #22c55e;
        }
        .action-button.absent {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        .action-button.absent:hover:not(:disabled) {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }
        .action-button.absent.active {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
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
      `}</style>
    </div>
  );
}; 