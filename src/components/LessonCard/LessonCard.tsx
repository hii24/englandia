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
  const [lessonSchedule, setLessonSchedule] = useState<any>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isTeacherLoading, setIsTeacherLoading] = useState(true);
  const [isScheduleLoading, setIsScheduleLoading] = useState(true);
  const { materials = [], additionalMaterials = [], homework = [] } = lesson;
  const user = useUserStore(s => s.user);
  const [studentProgress, setStudentProgress] = useState<any>(null);

  // Отладочная информация
  console.log('LessonCard render:', {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    progress: JSON.stringify(progress, null, 2), // Полное содержимое progress
    userRole: user?.role,
    userId: user?._id,
    teacherId,
    isTeacherLoading,
    isScheduleLoading
  });

  // Загружаем teacherId для ученика
  useEffect(() => {
    if (user?.role === 'student' && user._id) {
      console.log('🔍 LessonCard: Loading teacherId for student:', user._id);
      setIsTeacherLoading(true);
      
      fetch(`/api/students/teacher?studentId=${user._id}`)
        .then(response => {
          console.log('📡 LessonCard: Teacher API response status:', response.status);
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Failed to fetch teacher: ${response.status}`);
        })
        .then(data => {
          console.log('✅ LessonCard: Teacher loaded:', data);
          setTeacherId(data.teacherId);
        })
        .catch(error => {
          console.error('❌ LessonCard: Error loading teacher:', error);
          setTeacherId('default'); // Fallback
        })
        .finally(() => {
          setIsTeacherLoading(false);
        });
    } else {
      console.log('🔍 LessonCard: Not a student or no user ID, skipping teacher loading');
      setIsTeacherLoading(false);
    }
  }, [user?._id, user?.role]);

  // Загружаем информацию о блокировке сразу при рендере для учеников
  useEffect(() => {
    console.log('🔍 LessonCard: Loading lock info:', {
      userRole: user?.role,
      userId: user?._id,
      lessonId: lesson._id,
      willFetch: user?.role === 'student' && user._id && lesson._id
    });

    if (user?.role === 'student' && user._id && lesson._id) {
      fetchStudentLesson(user._id, lesson._id)
        .then(data => {
          console.log('✅ LessonCard: Lock info loaded:', data);
          // Устанавливаем информацию о блокировке из прогресса ученика
          setStudentProgress(data);
        })
        .catch((error) => {
          console.error('❌ LessonCard: Error loading lock info:', error);
          setStudentProgress(null);
        });
    } else {
      setStudentProgress(null);
    }
  }, [user?._id, user?.role, lesson._id]);

  // Загружаем индивидуальные lessonLink для студента (только при открытии)
  useEffect(() => {
    console.log('🔍 LessonCard: Loading student lesson data:', {
      open,
      userRole: user?.role,
      userId: user?._id,
      lessonId: lesson._id,
      willFetch: open && user?.role === 'student' && user._id && lesson._id
    });

    if (open && user?.role === 'student' && user._id && lesson._id) {
      fetchStudentLesson(user._id, lesson._id)
        .then(data => {
          console.log('✅ LessonCard: Student lesson data loaded:', data);
          setStudentLessonLink(data.lessonLink || null);
          // Обновляем информацию о блокировке
          setStudentProgress(data);
        })
        .catch((error) => {
          console.error('❌ LessonCard: Error loading student lesson data:', error);
          setStudentLessonLink(null);
          setStudentProgress(null);
        });
    } else {
      console.log('🔍 LessonCard: Resetting student lesson data');
      setStudentLessonLink(null);
      // НЕ сбрасываем studentProgress здесь, так как он загружается отдельно
    }
  }, [open, user?._id, user?.role, lesson._id]);

  // Загружаем расписание урока для ученика
  useEffect(() => {
    if (user?.role === 'student' && user._id && lesson._id && teacherId) {
      console.log('🔍 LessonCard: Loading schedule for:', {
        lessonId: lesson._id,
        studentId: user._id,
        teacherId
      });
      setIsScheduleLoading(true);
      
      fetch(`/api/lessons/schedule?lessonId=${lesson._id}&studentId=${user._id}&teacherId=${teacherId}`)
        .then(response => {
          console.log('📡 LessonCard: Schedule API response status:', response.status);
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Failed to fetch schedule: ${response.status}`);
        })
        .then(data => {
          console.log('✅ LessonCard: Schedule loaded:', data);
          setLessonSchedule(data);
        })
        .catch(error => {
          console.error('❌ LessonCard: Error loading lesson schedule:', error);
          setLessonSchedule(null);
        })
        .finally(() => {
          setIsScheduleLoading(false);
        });
    } else {
      setIsScheduleLoading(false);
    }
  }, [user?._id, user?.role, lesson._id, teacherId]);

  // Статус урока - определяем на основе посещения и статуса
  const status = progress?.attended ? 'completed' : 'not_started';
  
  // Для учеников показываем дату занятия вместо "Не начат"
  const getStatusText = () => {
    console.log('🔍 LessonCard: getStatusText called with:', {
      status,
      userRole: user?.role,
      lessonSchedule,
      lessonScheduleEnabled: lessonSchedule?.enabled,
      lessonScheduleDate: lessonSchedule?.scheduledDate,
      lessonScheduleTime: lessonSchedule?.time,
      teacherId,
      isTeacherLoading,
      isScheduleLoading
    });
    
    if (status === 'completed') {
      console.log('📅 LessonCard: Lesson completed, returning "Завершён"');
      return 'Завершён';
    }
    
    if (user?.role === 'student' && lessonSchedule?.enabled && lessonSchedule?.scheduledDate) {
      const scheduledDate = new Date(lessonSchedule.scheduledDate);
      const now = new Date();
      
      console.log('📅 LessonCard: Processing scheduled date:', {
        scheduledDate: scheduledDate.toISOString(),
        now: now.toISOString(),
        isPast: scheduledDate < now,
        isToday: scheduledDate.toDateString() === now.toDateString()
      });
      
      // Если дата в прошлом, показываем "Пропущен"
      if (scheduledDate < now) {
        const result = `Пропущен (${scheduledDate.toLocaleDateString('ru-RU')} в ${lessonSchedule.time})`;
        console.log('📅 LessonCard: Past date result:', result);
        return result;
      }
      
      // Если дата сегодня, показываем "Сегодня"
      if (scheduledDate.toDateString() === now.toDateString()) {
        const result = `Сегодня в ${lessonSchedule.time}`;
        console.log('📅 LessonCard: Today result:', result);
        return result;
      }
      
      // Если дата в будущем, показываем дату
      const result = `${scheduledDate.toLocaleDateString('ru-RU')} в ${lessonSchedule.time}`;
      console.log('📅 LessonCard: Future date result:', result);
      return result;
    }
    
    console.log('📅 LessonCard: Default result: Не начат (no schedule or not student)');
    return 'Не начат';
  };

  const statusMap: Record<string, { text: string; color: string; className: string }> = {
    completed: { text: getStatusText(), color: '#22c55e', className: 'dot--completed' },
    in_progress: { text: 'В процессе', color: '#facc15', className: 'dot--in_progress' },
    not_started: { text: getStatusText(), color: '#d1d5db', className: 'dot--not_started' },
  };
  const statusObj = statusMap[status] || statusMap['not_started'];

  // Добавляем информацию о дате посещения
  const attendanceInfo = progress?.attendanceDate ? (
    <div className="text-xs text-gray-500 mt-1">
      Посещён: {new Date(progress.attendanceDate).toLocaleDateString('ru-RU')}
    </div>
  ) : null;

  console.log('LessonCard Status Debug:', {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    progress: progress,
    status,
    statusObj,
    hasProgress: !!progress,
    attendanceInfo: !!attendanceInfo,
    statusText: statusObj.text,
    statusColor: statusObj.color,
    statusClassName: statusObj.className
  });

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
  // Домашка - всегда показываем из урока, без индивидуальных данных
  const effectiveHomework = homework;

  // Отладочная информация для домашних заданий
  console.log('🔍 LessonCard Homework Debug:', {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    userRole: user?.role,
    originalHomework: homework,
    effectiveHomework: effectiveHomework,
    effectiveHomeworkLength: effectiveHomework.length,
    willShowHomework: effectiveHomework.length > 0
  });

  // Функция для нормализации URL
  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    // Если URL уже абсолютный (начинается с http:// или https://), возвращаем как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Если URL начинается с //, добавляем https:
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    // Если URL начинается с /, это относительный путь от корня домена
    if (url.startsWith('/')) {
      return url;
    }
    // Для остальных случаев добавляем https://
    return `https://${url}`;
  };

  // Проверяем, заблокирован ли урок для ученика (индивидуальная блокировка)
  const isLessonLocked = user?.role === 'student' && studentProgress?.isLocked;

  // Обработчик клика с учетом блокировки
  const handleToggle = () => {
    if (isLessonLocked) {
      alert('Этот урок заблокирован. Обратитесь к учителю для доступа.');
      return;
    }
    setOpen(v => !v);
  };

  return (
    <div className={`lesson-card${open ? ' lesson-card--open' : ''}${isLessonLocked ? ' lesson-card--locked' : ''}`}>
      <div className="lesson-card__header">
        <div className="lesson-card__order">
          Урок {lesson.orderNumber}
          {isLessonLocked && (
            <span className="lesson-lock-icon" title="Урок заблокирован учителем">
              🔒
            </span>
          )}
        </div>
        <div className="lesson-card__content">
          <div className="lesson-card__title">
            {lesson.title}
            {isLessonLocked && (
              <span className="title-lock-indicator" title="Урок заблокирован учителем">
                🔒
              </span>
            )}
          </div>
          <div className="lesson-card__desc">{lesson.description}</div>
        </div>
        <div className="lesson-card__status">
          <span className={`dot ${statusObj.className}`}></span>
          {statusObj.text}
          {isLessonLocked && (
            <span className="status-lock-indicator" title="Урок заблокирован учителем">
              🔒
            </span>
          )}
        </div>
        <button
          className={`lesson-card__toggle${open ? ' lesson-card__toggle--open' : ''}${isLessonLocked ? ' lesson-card__toggle--locked' : ''}`}
          onClick={handleToggle}
          aria-label={isLessonLocked ? 'Урок заблокирован' : (open ? 'Свернуть' : 'Развернуть')}
        >
          <span className="lesson-card__toggle-icon">
            {isLessonLocked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            ) : (
              <Image src="/roll-btn.svg" alt="roll-btn" width={50} height={50} />
            )}
          </span>
        </button>
      </div>
      {/* Показываем содержимое только если открыт и НЕ заблокирован */}
      {open && !isLessonLocked && (
        <div className="lesson-card__body">
          {/* Ссылка на занятие */}
          {effectiveLessonLink && effectiveLessonLink.url && (effectiveLessonLink.forStudent !== false || user?.role !== 'student') && (
            <div className="lesson-card__materials-block mb-2">
              <span className="font-semibold">Ссылка на занятие:</span>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li key={`lesson-link-${effectiveLessonLink.url}`}>
                  <a href={normalizeUrl(effectiveLessonLink.url)} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium">
                    {effectiveLessonLink.title || effectiveLessonLink.url}
                  </a>
                </li>
              </ul>
            </div>
          )}
          {/* Материалы */}
          {visibleMaterials.length > 0 && (
            <div className="lesson-card__materials-block mb-2">
              <span className="font-semibold">Учебные материалы урока:</span>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {visibleMaterials.map((m, i) => (
                  <li key={`${m.url}-${i}`}>
                    <a href={normalizeUrl(m.url)} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium">{m.title || m.url}</a>
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
                  <li key={`${m.url}-${i}`}>
                    <a href={normalizeUrl(m.url)} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium">{m.title || m.url}</a>
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
                  <li key={`${m.url}-${i}`}>
                    <a href={normalizeUrl(m.url)} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-medium">{m.title || m.url}</a>
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