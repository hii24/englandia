import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface EditLessonData {
  title: string;
  description: string;
  orderNumber: number;
  materials: Array<{
    title: string;
    url: string;
    type: string;
    forStudent: boolean;
  }>;
  homework: Array<{
    title: string;
    url: string;
    type: string;
    forStudent: boolean;
  }>;
}

export const EditLessonsTab: React.FC = () => {
  const { lessons, loadLessons, editLesson, removeLesson } = useLessonStore();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'materials' | 'homework'>('main');
  const [editData, setEditData] = useState<EditLessonData>({
    title: '',
    description: '',
    orderNumber: 1,
    materials: [],
    homework: []
  });

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  // Отладочная информация
  useEffect(() => {
    console.log('Уроки загружены:', lessons);
  }, [lessons]);

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setEditData({
      title: lesson.title || '',
      description: lesson.description || '',
      orderNumber: lesson.orderNumber || 1,
      materials: lesson.materials || [],
      homework: lesson.homework || []
    });
    setEditMode(true);
    setActiveTab('main');
  };

  const handleSaveLesson = async () => {
    if (!selectedLesson) return;
    try {
      const lessonId = selectedLesson._id || selectedLesson.id;
      await editLesson(lessonId, editData);
      setEditMode(false);
      setSelectedLesson(null);
      loadLessons();
      alert('Урок обновлён!');
    } catch (error) {
      console.error('Ошибка обновления урока:', error);
      alert('Ошибка обновления урока');
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;
    if (!window.confirm('Удалить этот урок?')) return;
    try {
      const lessonId = selectedLesson._id || selectedLesson.id;
      await removeLesson(lessonId);
      setEditMode(false);
      setSelectedLesson(null);
      loadLessons();
      alert('Урок удалён!');
    } catch (error) {
      console.error('Ошибка удаления урока:', error);
      alert('Ошибка удаления урока');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedLesson(null);
  };

  // Функции для материалов
  const addMaterial = () => setEditData(data => ({
    ...data,
    materials: [...(data.materials || []), { title: '', url: '', type: 'link', forStudent: false }]
  }));

  const removeMaterial = (idx: number) => setEditData(data => ({
    ...data,
    materials: data.materials.filter((_, i) => i !== idx)
  }));

  const updateMaterial = (idx: number, patch: any) => setEditData(data => ({
    ...data,
    materials: data.materials.map((m, i) => i === idx ? { ...m, ...patch } : m)
  }));

  // Функции для домашних заданий
  const addHomework = () => setEditData(data => ({
    ...data,
    homework: [...(data.homework || []), { title: '', url: '', type: 'link', forStudent: true }]
  }));

  const removeHomework = (idx: number) => setEditData(data => ({
    ...data,
    homework: data.homework.filter((_, i) => i !== idx)
  }));

  const updateHomework = (idx: number, patch: any) => setEditData(data => ({
    ...data,
    homework: data.homework.map((h, i) => i === idx ? { ...h, ...patch } : h)
  }));

  if (editMode) {
    return (
      <div className="edit-lesson-container">
        <h4 className="edit-title">Редактирование урока</h4>
        
        <div className="edit-tabs">
          <button className={`edit-tab ${activeTab==='main' ? 'active' : ''}`} onClick={()=>setActiveTab('main')}>Основное</button>
          <button className={`edit-tab ${activeTab==='materials' ? 'active' : ''}`} onClick={()=>setActiveTab('materials')}>Материалы</button>
          <button className={`edit-tab ${activeTab==='homework' ? 'active' : ''}`} onClick={()=>setActiveTab('homework')}>Домашние задания</button>
        </div>
        
        <div className="edit-content">
          {activeTab === 'main' && (
            <div className="tab-content">
              <div className="form-group">
                <label className="form-label">Название урока</label>
                <input
                  value={editData.title}
                  onChange={e => setEditData({...editData, title: e.target.value})}
                  placeholder="Введите название урока"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Описание урока</label>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({...editData, description: e.target.value})}
                  placeholder="Введите описание урока"
                  className="form-textarea"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Порядковый номер</label>
                <input
                  type="number"
                  value={editData.orderNumber}
                  onChange={e => setEditData({...editData, orderNumber: Number(e.target.value)})}
                  placeholder="1"
                  className="form-input"
                  min={1}
                />
              </div>
            </div>
          )}
          {activeTab === 'materials' && (
            <div className="tab-content">
              <h5 className="tab-title">Материалы:</h5>
              <div className="materials-list">
                {(editData.materials || []).map((mat, idx) => (
                  <div key={idx} className="material-item">
                    <input
                      value={mat.title}
                      onChange={e => updateMaterial(idx, { title: e.target.value })}
                      placeholder="Название материала"
                      className="form-input"
                    />
                    <input
                      value={mat.url}
                      onChange={e => updateMaterial(idx, { url: e.target.value })}
                      placeholder="Ссылка на материал"
                      className="form-input"
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!mat.forStudent}
                        onChange={e => updateMaterial(idx, { forStudent: e.target.checked })}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Показывать ученику</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeMaterial(idx)}
                      className="remove-button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMaterial}
                className="add-button"
              >
                + Добавить материал
              </button>
            </div>
          )}
          {activeTab === 'homework' && (
            <div className="tab-content">
              <h5 className="tab-title">Домашние задания:</h5>
              <div className="materials-list">
                {(editData.homework || []).map((hw, idx) => (
                  <div key={idx} className="material-item">
                    <input
                      value={hw.title}
                      onChange={e => updateHomework(idx, { title: e.target.value })}
                      placeholder="Название домашнего задания"
                      className="form-input"
                    />
                    <input
                      value={hw.url}
                      onChange={e => updateHomework(idx, { url: e.target.value })}
                      placeholder="Ссылка на задание"
                      className="form-input"
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!hw.forStudent}
                        onChange={e => updateHomework(idx, { forStudent: e.target.checked })}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Показывать ученику</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeHomework(idx)}
                      className="remove-button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addHomework}
                className="add-button"
              >
                + Добавить домашнее задание
              </button>
            </div>
          )}
        </div>
        
        <div className="edit-actions">
          <button
            onClick={handleDeleteLesson}
            className="delete-button"
          >
            Удалить урок
          </button>
          <div className="action-buttons">
            <button
              onClick={handleCancelEdit}
              className="cancel-button"
            >
              Отмена
            </button>
            <button
              onClick={handleSaveLesson}
              className="save-button"
            >
              Сохранить
            </button>
          </div>
        </div>

        <style jsx>{`
          .edit-lesson-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 20px;
          }
          .edit-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 24px 0;
          }
          .edit-tabs {
            display: flex;
            gap: 2px;
            margin-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
          }
          .edit-tab {
            padding: 12px 16px;
            border: none;
            background: #f1f5f9;
            color: #64748b;
            font-weight: 600;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            transition: all 0.2s;
          }
          .edit-tab.active {
            background: #7c3aed;
            color: white;
          }
          .edit-content {
            flex: 1;
            overflow-y: auto;
          }
          .tab-content {
            padding: 20px 0;
          }
          .tab-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 16px 0;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 20px;
          }
          .form-label {
            font-weight: 500;
            color: #374151;
            font-size: 14px;
          }
          .form-input, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            transition: all 0.2s;
          }
          .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: #7c3aed;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          }
          .form-textarea {
            resize: vertical;
            min-height: 100px;
          }
          .materials-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 16px;
          }
          .material-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            gap: 12px;
            align-items: center;
          }
          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
          }
          .checkbox-input {
            width: 16px;
            height: 16px;
            accent-color: #7c3aed;
          }
          .checkbox-text {
            font-size: 14px;
            color: #374151;
          }
          .form-help-text {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
            font-style: italic;
          }
          .remove-button {
            padding: 8px 12px;
            background: #fef2f2;
            color: #dc2626;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
          }
          .remove-button:hover {
            background: #fee2e2;
          }
          .add-button {
            padding: 12px 20px;
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .add-button:hover {
            background: #6d28d9;
          }
          .edit-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          .action-buttons {
            display: flex;
            gap: 12px;
          }
          .delete-button {
            padding: 10px 20px;
            background: #dc2626;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .delete-button:hover {
            background: #b91c1c;
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
          .save-button:hover {
            background: #6d28d9;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="edit-lessons-container">
      <h3 className="edit-lessons-title">Редактирование уроков</h3>
      <div className="lessons-list">
        {lessons.map((lesson: any) => (
          <div key={lesson._id} className="lesson-item">
            <div className="lesson-info">
              <div className="lesson-header">
                <h4 className="lesson-title">Урок {lesson.orderNumber}: {lesson.title}</h4>
              </div>
              <p className="lesson-description">{lesson.description}</p>
              <div className="lesson-meta">
                <span className="meta-item">Материалов: {lesson.materials?.length || 0}</span>
                <span className="meta-item">Домашних заданий: {lesson.homework?.length || 0}</span>
              </div>
            </div>
            <button onClick={() => handleEditLesson(lesson)} className="edit-button">
              Редактировать
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .edit-lessons-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        .edit-lessons-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 24px 0;
        }
        .lessons-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lesson-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lesson-info {
          flex: 1;
        }
        .lesson-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lesson-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }
        .lesson-description {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 12px 0;
        }
        .lesson-meta {
          display: flex;
          gap: 16px;
        }
        .meta-item {
          background: #f1f5f9;
          color: #64748b;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        .edit-button {
          padding: 10px 20px;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .edit-button:hover {
          background: #6d28d9;
        }
      `}</style>
    </div>
  );
}; 