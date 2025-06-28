import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

interface TeacherLessonsTabProps {
  selectedStudent: any;
}

interface EditData {
  lessonLink: { title: string; url: string };
}

export const TeacherLessonsTab: React.FC<TeacherLessonsTabProps> = ({ selectedStudent }) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const user = useUserStore(s => s.user);

  useEffect(() => {
    if (selectedStudent) {
      loadLessons();
    }
  }, [selectedStudent]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lessons');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки уроков:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLesson = async (lesson: any) => {
    // Загружаем данные для конкретного ученика и урока
    try {
      const response = await fetch(`/api/progress/student-lesson?studentId=${selectedStudent._id}&lessonId=${lesson._id}`);
      if (response.ok) {
        const data = await response.json();
        setEditData({
          lessonLink: data.lessonLink || { title: '', url: '' }
        });
      } else {
        setEditData({
          lessonLink: { title: '', url: '' }
        });
      }
    } catch (error) {
      setEditData({
        lessonLink: { title: '', url: '' }
      });
    }
    setEditingLessonId(lesson._id);
  };

  const handleSave = async () => {
    if (!editData || !editingLessonId || !selectedStudent?._id) return;

    setSaving(true);
    try {
      console.log('Saving lesson data:', {
        studentId: selectedStudent._id,
        lessonId: editingLessonId,
        lessonLink: editData.lessonLink
      });

      const response = await fetch(`/api/progress/student-lesson`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          lessonId: editingLessonId,
          lessonLink: editData.lessonLink
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Save successful:', result);
        setEditData(null);
        setEditingLessonId(null);
      } else {
        const errorData = await response.json();
        console.error('Ошибка сохранения:', response.status, errorData);
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setEditingLessonId(null);
  };

  const updateLessonLink = (field: string, value: string) => {
    setEditData(prev => prev ? {
      ...prev,
      lessonLink: {
        ...prev.lessonLink,
        [field]: value
      }
    } : null);
  };

  if (editData && editingLessonId) {
    const lesson = lessons.find(l => l._id === editingLessonId);
    
    return (
      <div className="edit-lesson-container">
        <div className="edit-header">
          <h3>Урок {lesson?.orderNumber}: {lesson?.title}</h3>
          <div className="lesson-description">{lesson?.description}</div>
        </div>

        {/* Поле для ссылки на урок */}
        <div className="lesson-link-section">
          <h4>Ссылка на урок</h4>
          <div className="link-fields">
            <div className="field-group">
              <label>Название:</label>
              <input
                type="text"
                value={editData.lessonLink.title}
                onChange={(e) => updateLessonLink('title', e.target.value)}
                placeholder="Название ссылки"
                className="link-input"
              />
            </div>
            <div className="field-group">
              <label>URL:</label>
              <input
                type="text"
                value={editData.lessonLink.url}
                onChange={(e) => updateLessonLink('url', e.target.value)}
                placeholder="https://zoom.us/..."
                className="link-input"
              />
            </div>
          </div>
        </div>

        {/* Материалы (только просмотр) */}
        {lesson?.materials && lesson.materials.length > 0 && (
          <div className="materials-section">
            <h4>Материалы урока (только просмотр)</h4>
            <div className="materials-list">
              {lesson.materials.map((material: any, idx: number) => (
                <div key={idx} className="material-item">
                  <div className="material-header">
                    <span className="material-title">{material.title}</span>
                    <span className="material-type">[{material.type}]</span>
                  </div>
                  <div className="material-url">
                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="material-link">
                      {material.url}
                    </a>
                  </div>
                  {material.forStudent && (
                    <span className="student-badge">Для ученика</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="edit-actions">
          <button onClick={handleCancelEdit} className="cancel-button">
            Отмена
          </button>
          <button onClick={handleSave} className="save-button" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>

        <style jsx>{`
          .edit-lesson-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 20px;
          }
          .edit-header {
            margin-bottom: 24px;
          }
          .edit-header h3 {
            margin: 0 0 8px 0;
            color: #1e293b;
            font-size: 20px;
          }
          .lesson-description {
            color: #64748b;
            font-size: 14px;
          }
          .lesson-link-section {
            margin-bottom: 24px;
            padding: 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }
          .lesson-link-section h4 {
            margin: 0 0 12px 0;
            color: #1e293b;
            font-size: 16px;
          }
          .link-fields {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .field-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .field-group label {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
          }
          .link-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          }
          .link-input:focus {
            outline: none;
            border-color: #7c3aed;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          }
          .materials-section {
            flex: 1;
            overflow-y: auto;
          }
          .materials-section h4 {
            margin: 0 0 16px 0;
            color: #1e293b;
            font-size: 16px;
          }
          .materials-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .material-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
          }
          .material-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          .material-title {
            font-weight: 600;
            color: #1e293b;
          }
          .material-type {
            color: #64748b;
            font-size: 12px;
          }
          .material-url {
            margin-bottom: 8px;
          }
          .material-link {
            color: #7c3aed;
            text-decoration: underline;
            word-break: break-all;
          }
          .student-badge {
            background: #dcfce7;
            color: #166534;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .edit-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          .cancel-button {
            padding: 10px 20px;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .cancel-button:hover {
            background: #4b5563;
          }
          .save-button {
            padding: 10px 20px;
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .save-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }
          .save-button:not(:disabled):hover {
            background: #6d28d9;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="teacher-lessons-container">
      {loading ? (
        <div className="loading-indicator">Загрузка уроков...</div>
      ) : (
        <div className="lessons-list">
          {lessons.map((lesson: any) => (
            <div key={lesson._id} className="lesson-card">
              <div className="lesson-content">
                <div className="lesson-header">
                  <div className="lesson-title">Урок {lesson.orderNumber}: {lesson.title}</div>
                  <div className="lesson-description">{lesson.description}</div>
                </div>
              </div>
              
              <div className="lesson-actions">
                <button
                  onClick={() => handleEditLesson(lesson)}
                  className="edit-button"
                >
                  Открыть
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .teacher-lessons-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        .loading-indicator {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }
        .lessons-list {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lesson-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.2s;
        }
        .lesson-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
        }
        .lesson-content {
          flex: 1;
        }
        .lesson-header {
          margin-bottom: 16px;
        }
        .lesson-title {
          font-weight: 600;
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .lesson-description {
          color: #64748b;
          font-size: 14px;
        }
        .lesson-actions {
          margin-left: 20px;
        }
        .edit-button {
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .edit-button:hover {
          background: #6d28d9;
        }
      `}</style>
    </div>
  );
}; 