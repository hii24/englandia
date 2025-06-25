import React, { useState } from 'react';
import { LessonCardProps, LessonMaterial } from './LessonCard.types';

export const LessonCardGuestView: React.FC<LessonCardProps> = ({ lesson }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lesson-card${open ? ' lesson-card--open' : ''}`}>
      <div className="lesson-card__header">
        <div>
          <span className="lesson-card__order">Урок {lesson.orderNumber}</span>
          <span className="lesson-card__title">{lesson.title}</span>
          <span className="lesson-card__desc">{lesson.description}</span>
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
        </div>
      )}
    </div>
  );
}; 