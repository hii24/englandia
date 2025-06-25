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
      <div className="modal">
        <button className="modal__close" onClick={onClose}>×</button>
        <h3>Настройки урока</h3>
        <form onSubmit={handleSave}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название" required />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание" required />
          <input type="number" value={orderNumber} onChange={e => setOrderNumber(Number(e.target.value))} placeholder="Порядковый номер" min={1} required />
          <button type="submit" disabled={loading}>Сохранить</button>
        </form>
        <button onClick={handleDelete} style={{ marginTop: 16, background: '#f87171', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600 }}>Удалить урок</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
      <style jsx>{`
        .modal-overlay { position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #fff; border-radius: 16px; padding: 32px 24px; min-width: 320px; max-width: 90vw; box-shadow: 0 4px 32px rgba(0,0,0,0.12); position: relative; }
        .modal__close { position: absolute; right: 16px; top: 16px; background: none; border: none; font-size: 28px; cursor: pointer; }
        form input { display: block; width: 100%; margin-bottom: 12px; padding: 8px; border-radius: 8px; border: 1px solid #eee; }
        form button { background: #7c3aed; color: #fff; border: none; border-radius: 8px; padding: 10px 24px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}; 