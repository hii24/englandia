import React, { useState } from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface LessonSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: any;
}

export const LessonSettingsModal: React.FC<LessonSettingsModalProps> = ({ isOpen, onClose, lesson }) => {
  const editLesson = useLessonStore((state: any) => state.editLesson);
  const removeLesson = useLessonStore((state: any) => state.removeLesson);
  const loading = useLessonStore((state: any) => state.loading);
  const [title, setTitle] = useState(lesson.title || '');
  const [description, setDescription] = useState(lesson.description || '');
  const [orderNumber, setOrderNumber] = useState(lesson.orderNumber || 1);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await editLesson(lesson._id || lesson.id, { title, description, orderNumber });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Ошибка редактирования');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить урок?')) {
      await removeLesson(lesson._id || lesson.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal--lesson-settings">
        <button className="modal__close" onClick={onClose}>×</button>
        
        <div className="lesson-settings-content">
          <div className="lesson-settings-header">
            <h2>Настройки урока</h2>
            <p>Редактирование параметров урока "{lesson.title}"</p>
          </div>
          
          <div className="lesson-settings-body">
            <form onSubmit={handleSave} className="lesson-form">
              <div className="form-group">
                <label htmlFor="title">Название урока</label>
                <input 
                  id="title"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Введите название урока" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Описание урока</label>
                <textarea 
                  id="description"
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Введите описание урока" 
                  required 
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="orderNumber">Порядковый номер</label>
                <input 
                  id="orderNumber"
                  type="number" 
                  value={orderNumber} 
                  onChange={e => setOrderNumber(Number(e.target.value))} 
                  placeholder="Порядковый номер" 
                  min={1} 
                  required 
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
                
                <button 
                  type="button"
                  onClick={handleDelete} 
                  className="btn btn-danger"
                >
                  Удалить урок
                </button>
              </div>
              
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay { 
          position: fixed; 
          left: 0; 
          top: 0; 
          width: 100vw; 
          height: 100vh; 
          background: rgba(0,0,0,0.25); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 1000; 
        }
        .modal { 
          background: #fff; 
          border-radius: 16px; 
          box-shadow: 0 4px 32px rgba(0,0,0,0.12); 
          position: relative; 
          display: flex;
          width: 95vw;
          height: 95vh;
          max-width: 95vw;
          max-height: 95vh;
          overflow: hidden;
        }
        .modal--lesson-settings {
          flex-direction: column;
        }
        .modal__close { 
          position: absolute; 
          right: 16px; 
          top: 16px; 
          background: none; 
          border: none; 
          font-size: 28px; 
          cursor: pointer;
          z-index: 10;
          color: #64748b;
          transition: color 0.2s;
        }
        .modal__close:hover {
          color: #1e293b;
        }
        .lesson-settings-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .lesson-settings-header {
          padding: 32px 32px 24px 32px;
          border-bottom: 1px solid #e2e8f0;
        }
        .lesson-settings-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }
        .lesson-settings-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .lesson-settings-body {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
        .lesson-form {
          max-width: 600px;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 32px;
        }
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-primary {
          background: #7c3aed;
          color: white;
        }
        .btn-primary:hover:not(:disabled) {
          background: #6d28d9;
        }
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        .btn-danger:hover {
          background: #dc2626;
        }
        .error-message {
          margin-top: 16px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}; 