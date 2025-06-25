import React, { useState } from 'react';
import { LessonCardProps, LessonMaterial } from './LessonCard.types';

const statusText = (status?: string, completedAt?: string) => {
  if (status === 'completed') return 'Завершён';
  if (status === 'in_progress') return 'В процессе';
  if (status === 'skipped') return 'Пропущен';
  if (completedAt) return completedAt;
  return 'Не начат';
};

export const LessonCardTeacherView: React.FC<LessonCardProps> = ({ lesson, progress }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lesson-card${open ? ' lesson-card--open' : ''}`}>
      <div className="lesson-card__header">
        <div>
          <span className="lesson-card__order">Урок {lesson.orderNumber}</span>
          <span className="lesson-card__title">{lesson.title}</span>
          <span className="lesson-card__desc">{lesson.description}</span>
        </div>
        <div className="lesson-card__status">
          <span className={`dot dot--${progress?.status || 'not_started'}`}></span>
          {statusText(progress?.status, progress?.completedAt)}
        </div>
        <button className="lesson-card__toggle" onClick={() => setOpen(v => !v)}>
          {open ? '▲' : '▼'}
        </button>
      </div>
      {open && (
        <div className="lesson-card__body">
          {lesson.videoUrl && (
            <div className="lesson-card__video">
              <img src="/lesson-video-placeholder.jpg" alt="Видео" style={{ width: '100%', borderRadius: 16 }} />
            </div>
          )}
          <div className="lesson-card__materials">
            {lesson.materials.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Учебные материалы урока</span>
                {lesson.materials.map((m: LessonMaterial) =>
                  m.type === 'file' ? (
                    <a key={m.url} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                  ) : null
                )}
              </div>
            )}
            {lesson.additionalMaterials.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Дополнительные материалы</span>
                {lesson.additionalMaterials.map((m: LessonMaterial) =>
                  m.type === 'file' ? (
                    <a key={m.url} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                  ) : null
                )}
              </div>
            )}
            {lesson.homework.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Домашнее задание</span>
                {lesson.homework.map((m: LessonMaterial) =>
                  m.type === 'file' ? (
                    <a key={m.url} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                  ) : null
                )}
              </div>
            )}
          </div>
          <div className="lesson-card__teacher-actions">
            <button className="lesson-card__action">Отметить посещение</button>
            <button className="lesson-card__action">Добавить заметку</button>
          </div>
        </div>
      )}
    </div>
  );
}; 