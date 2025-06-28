import React, { useState } from 'react';
import { useLessonStore } from '@/store/lessonStore';

export const CreateLessonTab: React.FC = () => {
  const addLesson = useLessonStore((s: any) => s.addLesson);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    orderNumber: 1,
    videoUrl: '',
    materials: [],
    additionalMaterials: [],
    homework: []
  });

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
      alert('Урок успешно создан!');
    } catch (error) {
      console.error('Ошибка создания урока:', error);
      alert('Ошибка создания урока');
    }
  };

  return (
    <div className="create-lesson-container">
      <h4 className="section-title">Создать новый урок</h4>
      <div className="form-container">
        <div className="form-group">
          <label className="form-label">Название урока *</label>
          <input
            value={newLesson.title}
            onChange={e => setNewLesson({...newLesson, title: e.target.value})}
            placeholder="Введите название урока"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Описание урока *</label>
          <textarea
            value={newLesson.description}
            onChange={e => setNewLesson({...newLesson, description: e.target.value})}
            placeholder="Введите описание урока"
            className="form-textarea"
            rows={4}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Порядковый номер *</label>
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
            <label className="form-label">URL видео (опционально)</label>
            <input
              value={newLesson.videoUrl}
              onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})}
              placeholder="https://example.com/video"
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            onClick={handleCreateLesson}
            className="create-button"
            disabled={!newLesson.title || !newLesson.description}
          >
            Создать урок
          </button>
        </div>
      </div>

      <style jsx>{`
        .create-lesson-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        .section-title {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }
        .form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
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
        .form-actions {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .create-button {
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          width: 100%;
        }
        .create-button:hover:not(:disabled) {
          background: #6d28d9;
        }
        .create-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}; 