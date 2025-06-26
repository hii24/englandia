import React, { useState } from 'react';
import { Lesson, LessonProgress, LessonCard } from '../LessonCard';
import './LessonList.scss';
import { useUserStore } from '@/store/userStore';
import { useLessonStore } from '@/store/lessonStore';

interface LessonListProps {
  lessons: Lesson[];
  progresses?: LessonProgress[];
  isLoading?: boolean;
  error?: string;
}

export const LessonList: React.FC<LessonListProps> = ({ 
  lessons, 
  progresses = [], 
  isLoading = false,
  error 
}) => {
  const user = useUserStore(s => s.user);
  const selectedStudentId = useUserStore(s => s.selectedStudentId);
  const removeLesson = useLessonStore((s: any) => s.removeLesson);
  const [editId, setEditId] = useState<string | null>(null);

  // Фильтрация по ролям
  let filteredLessons = lessons;
  let filteredProgresses = progresses;
  if (user?.role === 'guest') {
    filteredLessons = lessons.filter(l => l.orderNumber === 1);
  } else if (user?.role === 'student') {
    // TODO: фильтрация по прогрессу (текущий + следующий)
    filteredLessons = lessons.slice(0, 2); // пример
  } else if (user?.role === 'teacher' && selectedStudentId) {
    // teacher: показываем прогресс выбранного ученика
    filteredProgresses = progresses.filter(p => p.lessonId === selectedStudentId);
  }

  if (error) {
    return (
      <div className="lesson-list lesson-list--error">
        <h3>Ошибка загрузки</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      
      <div className="lesson-list lesson-list--loading">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="lesson-card lesson-card--skeleton">
            <div className="lesson-card__header">
              <div>
                <div className="skeleton skeleton--text" style={{ width: '60px' }}></div>
                <div className="skeleton skeleton--text" style={{ width: '200px' }}></div>
                <div className="skeleton skeleton--text" style={{ width: '150px' }}></div>
              </div>
              <div className="skeleton skeleton--circle"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="lesson-list lesson-list--empty">
        <h3>Уроки не найдены</h3>
        <p>Пока что нет доступных уроков для изучения</p>
      </div>
    );
  }

  return (
    <div className="lesson-list">
      {filteredLessons.map((lesson) => (
        <div key={lesson._id} style={{ position: 'relative' }}>
          <LessonCard lesson={lesson} progress={filteredProgresses?.find(p => p.lessonId === lesson._id)} />
        </div>
      ))}
    </div>
  );
}; 