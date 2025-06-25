import React, { useState } from 'react';
import { LessonCardProps } from './LessonCard.types';
import { useUserStore } from '../../store/userStore';
import { LessonSettingsModal } from '@/modals/LessonSettingsModal';
import './LessonCard.scss';

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, progress }) => {
  const user = useUserStore((s) => s.user);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Деструктурируем поля с дефолтами
  const { materials = [], additionalMaterials = [], homework = [] } = lesson;
  const [open, setOpen] = useState(false);

  return (
    <div className={`lesson-card${open ? ' lesson-card--open' : ''}`} style={{ position: 'relative' }}>
      <div className="lesson-card__header">
        <div>
          <span className="lesson-card__order">Урок {lesson.orderNumber}</span>
          <span className="lesson-card__title">{lesson.title}</span>
          <span className="lesson-card__desc">{lesson.description}</span>
        </div>
        <div className="lesson-card__status">
          {progress && <span className={`dot dot--${progress.status || 'not_started'}`}></span>}
          {progress && (progress.status === 'completed' ? 'Завершён' : progress.status === 'in_progress' ? 'В процессе' : progress.status === 'skipped' ? 'Пропущен' : 'Не начат')}
        </div>
        <button className="lesson-card__toggle" onClick={() => setOpen(v => !v)}>
          {open ? '▲' : '▼'}
        </button>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button
            className="lesson-card__settings"
            onClick={() => setSettingsOpen(true)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}
            aria-label="Настройки урока"
          >
            ⚙️
          </button>
        )}
        <LessonSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} lesson={lesson} />
      </div>
      {open && (
        <div className="lesson-card__body">
          {lesson.videoUrl && (
            <div className="lesson-card__video">
              <img src="/lesson-video-placeholder.jpg" alt="Видео" style={{ width: '100%', borderRadius: 16 }} />
            </div>
          )}
          <div className="lesson-card__materials">
            {materials.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Учебные материалы урока</span>
                {materials.map((m) =>
                  m.type === 'file' ? (
                    <a key={m.url} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                  ) : null
                )}
              </div>
            )}
            {additionalMaterials.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Дополнительные материалы</span>
                {additionalMaterials.map((m) =>
                  m.type === 'file' ? (
                    <a key={m.url} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                  ) : null
                )}
              </div>
            )}
            {homework.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Домашнее задание</span>
                {homework.map((m) =>
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