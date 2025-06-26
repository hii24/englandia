import React, { useState } from 'react';
import Image from 'next/image';
import { LessonCardProps } from './LessonCard.types';
import './LessonCard.scss';

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, progress }) => {
  const [open, setOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { materials = [], additionalMaterials = [], homework = [] } = lesson;

  // Статус урока
  const status = progress?.status || 'not_started';
  const statusMap: Record<string, { text: string; color: string; className: string }> = {
    completed: { text: 'Завершён', color: '#22c55e', className: 'dot--completed' },
    in_progress: { text: 'В процессе', color: '#facc15', className: 'dot--in_progress' },
    skipped: { text: 'Пропущен', color: '#f87171', className: 'dot--skipped' },
    not_started: { text: 'Не начат', color: '#d1d5db', className: 'dot--not_started' },
  };
  const statusObj = statusMap[status] || statusMap['not_started'];

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  // Функция для получения YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  // Функция для получения Vimeo thumbnail
  const getVimeoThumbnail = (url: string) => {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId ? `https://vumbnail.com/${videoId}.jpg` : null;
  };

  const getVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeThumbnail(url);
    }
    if (url.includes('vimeo.com')) {
      return getVimeoThumbnail(url);
    }
    return null;
  };

  const thumbnail = lesson.videoUrl ? getVideoThumbnail(lesson.videoUrl) : null;

  return (
    <div className={`lesson-card${open ? ' lesson-card--open' : ''}`}>
      <div className="lesson-card__header">
        <div className="lesson-card__order">Урок {lesson.orderNumber}</div>
        <div className="lesson-card__content">
          <div className="lesson-card__title">{lesson.title}</div>
          <div className="lesson-card__desc">{lesson.description}</div>
        </div>
        <div className="lesson-card__status">
          <span className={`dot ${statusObj.className}`}></span>
          {statusObj.text}
        </div>
        <button
          className={`lesson-card__toggle${open ? ' lesson-card__toggle--open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Свернуть' : 'Развернуть'}
        >
          <span className="lesson-card__toggle-icon">
            <Image src="/roll-btn.svg" alt="roll-btn" width={50} height={50} />
          </span>
        </button>
      </div>
      {open && (
        <div className="lesson-card__body">
          {lesson.videoUrl && (
            <div className="lesson-card__video">
              {isVideoPlaying ? (
                <video
                  controls
                  autoPlay
                  onEnded={handleVideoEnd}
                  className="lesson-card__video-player"
                >
                  <source src={lesson.videoUrl} type="video/mp4" />
                  <source src={lesson.videoUrl} type="video/webm" />
                  Ваш браузер не поддерживает видео.
                </video>
              ) : (
                <>
                  {thumbnail ? (
                    <img src={thumbnail} alt="Превью видео" />
                  ) : (
                    <div className="lesson-card__video-placeholder">
                      <div className="lesson-card__video-placeholder-text">Видео урок</div>
                    </div>
                  )}
                  <button
                    className="lesson-card__video-play"
                    onClick={handleVideoPlay}
                    aria-label="Воспроизвести видео"
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="none"/>
                      <polygon points="13,10 24,16 13,22" fill="#fff"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
          <div className="lesson-card__materials">
            {materials.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Учебные материалы урока</span>
                <div className="lesson-card__materials-links">
                  {materials.map((m, i) =>
                    m.type === 'file' ? (
                      <a key={m.url || i} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                    ) : null
                  )}
                </div>
              </div>
            )}
            {additionalMaterials.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Дополнительные материалы</span>
                <div className="lesson-card__materials-links">
                  {additionalMaterials.map((m, i) =>
                    m.type === 'file' ? (
                      <a key={m.url || i} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                    ) : null
                  )}
                </div>
              </div>
            )}
            {homework.length > 0 && (
              <div className="lesson-card__materials-block">
                <span>Домашнее задание</span>
                <div className="lesson-card__materials-links">
                  {homework.map((m, i) =>
                    m.type === 'file' ? (
                      <a key={m.url || i} href={m.url} download className="lesson-card__download">Скачать [PDF]</a>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 