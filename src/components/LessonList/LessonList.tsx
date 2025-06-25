import React from 'react';
import { Lesson, LessonProgress, LessonCard } from '../LessonCard';
import './LessonList.scss';

interface LessonListProps {
  lessons: Lesson[];
  progresses?: LessonProgress[];
  isLoading?: boolean;
  error?: string;
}

export const LessonList: React.FC<LessonListProps> = ({ 
  lessons, 
  progresses, 
  isLoading = false,
  error 
}) => {
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
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          progress={progresses?.find(p => p.lessonId === lesson.id)}
        />
      ))}
    </div>
  );
}; 