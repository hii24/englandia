import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LessonCardProps } from './LessonCard.types';
import './LessonCard.scss';
import { useUserStore } from '@/store/userStore';
import { fetchStudentLesson } from '@/lib/api';

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, progress }) => {
  const [open, setOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [studentLessonLink, setStudentLessonLink] = useState<any>(null);
  const [studentHomework, setStudentHomework] = useState<any[] | null>(null);
  const { materials = [], additionalMaterials = [], homework = [] } = lesson;
  const user = useUserStore(s => s.user);

  // Загружаем индивидуальные lessonLink и homework для студента
  useEffect(() => {
    if (open && user?.role === 'student' && user._id && lesson._id) {
      fetchStudentLesson(user._id, lesson._id)
        .then(data => {
          setStudentLessonLink(data.lessonLink || null);
          setStudentHomework(Array.isArray(data.homework) ? data.homework : null);
        })
        .catch(() => {
          setStudentLessonLink(null);
          setStudentHomework(null);
        });
    } else {
      setStudentLessonLink(null);
      setStudentHomework(null);
    }
  }, [open, user?._id, user?.role, lesson._id]);

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

  const visibleMaterials = user?.role === 'student' || user?.role === 'guest'
    ? (lesson.materials || []).filter(m => m.forStudent)
    : (lesson.materials || []);

  // Ссылка на занятие
  const effectiveLessonLink = user?.role === 'student' && studentLessonLink ? studentLessonLink : lesson.lessonLink;
  // Домашка
  const effectiveHomework = user?.role === 'student' && studentHomework ? studentHomework : homework;

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
          {/* Ссылка на занятие */}
          {effectiveLessonLink && effectiveLessonLink.url && (effectiveLessonLink.forStudent !== false || user?.role !== 'student') && (
            <div className="lesson-card__lesson-link bg-violet-50 border border-violet-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.778 7.778a4 4 0 005.656 0l1.414-1.414a4 4 0 000-5.656m-7.778-7.778a4 4 0 015.656 0l1.414 1.414a4 4 0 010 5.656" /></svg>
              <span className="font-semibold text-violet-800">Ссылка на занятие:</span>
              <a href={effectiveLessonLink.url} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium ml-2">{effectiveLessonLink.title || effectiveLessonLink.url}</a>
            </div>
          )}
          {/* Материалы */}
          {visibleMaterials.length > 0 && (
            <div className="lesson-card__materials-block mb-2">
              <span className="font-semibold">Учебные материалы урока:</span>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {visibleMaterials.map((m, i) => (
                  <li key={m.url || i}>
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium">{m.title || m.url}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Домашка */}
          {effectiveHomework.length > 0 && (
            <div className="lesson-card__materials-block mb-2">
              <span className="font-semibold">Домашнее задание:</span>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {effectiveHomework.map((m, i) => (
                  <li key={m.url || i}>
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium">{m.title || m.url}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Дополнительные материалы */}
          {additionalMaterials.length > 0 && (
            <div className="lesson-card__materials-block mb-2">
              <span className="font-semibold">Дополнительные материалы:</span>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {additionalMaterials.map((m, i) => (
                  <li key={m.url || i}>
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium">{m.title || m.url}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 