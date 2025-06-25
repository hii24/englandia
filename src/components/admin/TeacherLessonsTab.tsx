import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface TeacherLessonsTabProps {
  selectedStudent: any;
}

interface HomeworkItem {
  url: string;
  type: 'file' | 'link';
}

export const TeacherLessonsTab: React.FC<TeacherLessonsTabProps> = ({ selectedStudent }) => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [homeworkData, setHomeworkData] = useState<{ homework: HomeworkItem[] }>({
    homework: []
  });

  useEffect(() => {
    if (selectedStudent) {
      loadLessons();
    }
  }, [selectedStudent, loadLessons]);

  const handleEditHomework = (lesson: any) => {
    setSelectedLesson(lesson);
    setHomeworkData({
      homework: lesson.homework || []
    });
    setEditMode(true);
  };

  const handleSaveHomework = async () => {
    if (!selectedLesson) return;
    
    try {
      // Здесь будет API для обновления домашнего задания
      console.log('Сохранение домашнего задания:', {
        lessonId: selectedLesson._id,
        homework: homeworkData.homework
      });
      
      // TODO: Добавить API endpoint для обновления домашнего задания
      // await updateLessonHomework(selectedLesson._id, homeworkData.homework);
      
      setEditMode(false);
      setSelectedLesson(null);
      alert('Домашнее задание обновлено!');
    } catch (error) {
      console.error('Ошибка обновления домашнего задания:', error);
      alert('Ошибка обновления домашнего задания');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedLesson(null);
  };

  const addHomeworkItem = () => {
    setHomeworkData({
      homework: [...homeworkData.homework, { url: '', type: 'file' as const }]
    });
  };

  const removeHomeworkItem = (index: number) => {
    setHomeworkData({
      homework: homeworkData.homework.filter((_, i) => i !== index)
    });
  };

  const updateHomeworkItem = (index: number, field: string, value: string) => {
    const newHomework = [...homeworkData.homework];
    newHomework[index] = { ...newHomework[index], [field]: value };
    setHomeworkData({ homework: newHomework });
  };

  if (!selectedStudent) {
    return (
      <div style={{ textAlign: 'center', color: '#666', padding: 20 }}>
        Сначала выберите ученика
      </div>
    );
  }

  if (editMode) {
    return (
      <div>
        <h4>Редактирование домашнего задания</h4>
        <p>Урок: {selectedLesson?.title}</p>
        <p>Ученик: {selectedStudent.firstName} {selectedStudent.lastName}</p>
        
        <div style={{ marginBottom: 16 }}>
          <h5>Домашние задания:</h5>
          {homeworkData.homework.map((item: any, index: number) => (
            <div key={index} style={{ 
              padding: 12, 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              marginBottom: 8,
              display: 'flex',
              gap: 8,
              alignItems: 'center'
            }}>
              <select
                value={item.type}
                onChange={(e) => updateHomeworkItem(index, 'type', e.target.value)}
                style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd' }}
              >
                <option value="file">Файл</option>
                <option value="link">Ссылка</option>
              </select>
              <input
                value={item.url}
                onChange={(e) => updateHomeworkItem(index, 'url', e.target.value)}
                placeholder="URL файла или ссылки"
                style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
              />
              <button
                onClick={() => removeHomeworkItem(index)}
                style={{ 
                  background: '#f87171', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Удалить
              </button>
            </div>
          ))}
          <button
            onClick={addHomeworkItem}
            style={{ 
              background: '#7c3aed', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Добавить задание
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
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
            onClick={handleSaveHomework}
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
      <h4>Уроки ученика: {selectedStudent.firstName} {selectedStudent.lastName}</h4>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {lessons.map((lesson: any) => (
          <div 
            key={lesson._id} 
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
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                Домашних заданий: {lesson.homework?.length || 0}
              </div>
            </div>
            <button
              onClick={() => handleEditHomework(lesson)}
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
              Редактировать ДЗ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 