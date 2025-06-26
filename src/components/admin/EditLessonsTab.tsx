import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';

export const EditLessonsTab: React.FC = () => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const editLesson = useLessonStore((s: any) => s.editLesson);
  const removeLesson = useLessonStore((s: any) => s.removeLesson);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    orderNumber: 1
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
      title: lesson.title,
      description: lesson.description,
      orderNumber: lesson.orderNumber
    });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedLesson) return;
    
    try {
      const lessonId = selectedLesson._id || selectedLesson.id;
      console.log('Редактирование урока:', {
        lessonId,
        selectedLesson,
        editData
      });
      
      await editLesson(lessonId, editData);
      setEditMode(false);
      setSelectedLesson(null);
      loadLessons();
      alert('Урок успешно обновлен!');
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

  if (editMode) {
    return (
      <div>
        <h4>Редактирование урока</h4>
        <input
          value={editData.title}
          onChange={e => setEditData({...editData, title: e.target.value})}
          placeholder="Название урока"
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <textarea
          value={editData.description}
          onChange={e => setEditData({...editData, description: e.target.value})}
          placeholder="Описание урока"
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd', minHeight: 80 }}
        />
        <input
          type="number"
          value={editData.orderNumber}
          onChange={e => setEditData({...editData, orderNumber: Number(e.target.value)})}
          placeholder="Порядковый номер"
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <button 
            onClick={handleDeleteLesson}
            style={{ 
              background: '#f87171', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              padding: '8px 16px', 
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Удалить урок
          </button>
          <button 
            onClick={handleCancelEdit}
            style={{ 
              background: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              padding: '8px 16px', 
              cursor: 'pointer' 
            }}
          >
            Отмена
          </button>
          <button 
            onClick={handleSaveEdit}
            style={{ 
              background: '#7c3aed', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              padding: '8px 16px', 
              cursor: 'pointer' 
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {lessons.map((lesson: any) => (
          <div 
            key={lesson._id || lesson.id} 
            style={{ 
              padding: 12, 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Урок {lesson.orderNumber}: {lesson.title}</div>
              <div style={{ fontSize: 14, color: '#666' }}>{lesson.description}</div>
            </div>
            <button
              onClick={() => handleEditLesson(lesson)}
              style={{ 
                background: '#7c3aed', 
                color: 'white', 
                border: 'none', 
                borderRadius: 6, 
                padding: '6px 12px', 
                cursor: 'pointer',
                fontSize: 12
              }}
            >
              Редактировать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 