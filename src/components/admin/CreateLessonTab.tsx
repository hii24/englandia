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
    <div>
      <input
        value={newLesson.title}
        onChange={e => setNewLesson({...newLesson, title: e.target.value})}
        placeholder="Название урока"
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <textarea
        value={newLesson.description}
        onChange={e => setNewLesson({...newLesson, description: e.target.value})}
        placeholder="Описание урока"
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd', minHeight: 80 }}
      />
      <input
        type="number"
        value={newLesson.orderNumber}
        onChange={e => setNewLesson({...newLesson, orderNumber: Number(e.target.value)})}
        placeholder="Порядковый номер"
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <input
        value={newLesson.videoUrl}
        onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})}
        placeholder="URL видео (опционально)"
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <button 
        onClick={handleCreateLesson}
        style={{ 
          background: '#7c3aed', 
          color: 'white', 
          border: 'none', 
          borderRadius: 8, 
          padding: '12px 24px', 
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Создать урок
      </button>
    </div>
  );
}; 