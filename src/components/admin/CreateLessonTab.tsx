import React, { useState } from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface Material {
  title: string;
  url: string;
  type: string;
  forStudent: boolean;
}

interface NewLesson {
  title: string;
  description: string;
  orderNumber: number;
  videoUrl: string;
  materials: Material[];
  additionalMaterials: Material[];
  homework: Material[];
}

export const CreateLessonTab: React.FC = () => {
  const addLesson = useLessonStore((s: any) => s.addLesson);
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: '',
    description: '',
    orderNumber: 1,
    videoUrl: '',
    materials: [],
    additionalMaterials: [],
    homework: []
  });
  const [activeTab, setActiveTab] = useState<'main' | 'materials' | 'homework'>('main');

  const handleCreateLesson = async () => {
    try {
      await addLesson(newLesson);
      setNewLesson({
        title: '',
        description: '',
        orderNumber: 1,
        videoUrl: '',
        materials: [],
        additionalMaterials: [],
        homework: []
      });
      setActiveTab('main');
      alert('Урок успешно создан!');
    } catch (error) {
      console.error('Ошибка создания урока:', error);
      alert('Ошибка создания урока');
    }
  };

  // Функции для материалов
  const addMaterial = () => setNewLesson(data => ({
    ...data,
    materials: [...data.materials, { title: '', url: '', type: 'link', forStudent: false }]
  }));

  const removeMaterial = (idx: number) => setNewLesson(data => ({
    ...data,
    materials: data.materials.filter((_, i) => i !== idx)
  }));

  const updateMaterial = (idx: number, patch: Partial<Material>) => setNewLesson(data => ({
    ...data,
    materials: data.materials.map((m, i) => i === idx ? { ...m, ...patch } : m)
  }));

  // Функции для домашних заданий
  const addHomework = () => setNewLesson(data => ({
    ...data,
    homework: [...data.homework, { title: '', url: '', type: 'link', forStudent: true }]
  }));

  const removeHomework = (idx: number) => setNewLesson(data => ({
    ...data,
    homework: data.homework.filter((_, i) => i !== idx)
  }));

  const updateHomework = (idx: number, patch: Partial<Material>) => setNewLesson(data => ({
    ...data,
    homework: data.homework.map((h, i) => i === idx ? { ...h, ...patch } : h)
  }));

  return (
    <div className="create-lesson-container">
      <h3 className="create-lesson-title">Создание нового урока</h3>
      
      <div className="create-tabs">
        <button className={`create-tab ${activeTab==='main' ? 'active' : ''}`} onClick={()=>setActiveTab('main')}>Основное</button>
        <button className={`create-tab ${activeTab==='materials' ? 'active' : ''}`} onClick={()=>setActiveTab('materials')}>Материалы</button>
        <button className={`create-tab ${activeTab==='homework' ? 'active' : ''}`} onClick={()=>setActiveTab('homework')}>Домашние задания</button>
      </div>
      
      <div className="create-content">
        {activeTab === 'main' && (
          <div className="tab-content">
            <div className="form-group">
              <label className="form-label">Название урока</label>
              <input
                value={newLesson.title}
                onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                placeholder="Введите название урока"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Описание урока</label>
              <textarea
                value={newLesson.description}
                onChange={e => setNewLesson({...newLesson, description: e.target.value})}
                placeholder="Введите описание урока"
                className="form-textarea"
                rows={4}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Порядковый номер</label>
              <input
                type="number"
                value={newLesson.orderNumber}
                onChange={e => setNewLesson({...newLesson, orderNumber: Number(e.target.value)})}
                placeholder="1"
                className="form-input"
                min={1}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ссылка на видео (опционально)</label>
              <input
                value={newLesson.videoUrl}
                onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})}
                placeholder="https://www.youtube.com/watch?v=..."
                className="form-input"
              />
            </div>
          </div>
        )}
        {activeTab === 'materials' && (
          <div className="tab-content">
            <h5 className="tab-title">Материалы:</h5>
            <div className="materials-list">
              {newLesson.materials.map((mat, idx) => (
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
            <button onClick={addMaterial} className="add-button">
              + Добавить материал
            </button>
          </div>
        )}
        {activeTab === 'homework' && (
          <div className="tab-content">
            <h5 className="tab-title">Домашние задания:</h5>
            <div className="materials-list">
              {newLesson.homework.map((hw, idx) => (
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
            <button onClick={addHomework} className="add-button">
              + Добавить домашнее задание
            </button>
          </div>
        )}
      </div>

      <div className="create-actions">
        <button 
          onClick={handleCreateLesson} 
          className="create-button"
          disabled={!newLesson.title.trim()}
        >
          Создать урок
        </button>
      </div>

      <style jsx>{`
        .create-lesson-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        .create-lesson-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 24px 0;
        }
        .create-tabs {
          display: flex;
          gap: 2px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .create-tab {
          padding: 12px 16px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          font-weight: 600;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          transition: all 0.2s;
        }
        .create-tab.active {
          background: #7c3aed;
          color: white;
        }
        .create-content {
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
        .create-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .create-button {
          padding: 12px 24px;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .create-button:hover:not(:disabled) {
          background: #6d28d9;
        }
        .create-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}; 