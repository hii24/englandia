import React, { useState, useEffect } from 'react';
import { LessonCard } from '@/components/LessonCard';
import { useUserStore } from '@/store/userStore';
import { useLessonStore } from '@/store/lessonStore';
import { fetchStudentProgress } from '@/lib/api';
import './LessonList.scss';

interface LessonListProps {
  lessons?: any[];
  progresses?: any[];
  isLoading?: boolean;
  error?: string | null;
}

interface StudentProgress {
  _id: string;
  lessonId: string;
  attended: boolean;
  attendanceDate?: string;
  attendanceConfirmedBy?: string;
  lessonLink?: { title: string; url: string; forStudent?: boolean };
  homework?: Array<{ title: string; url: string; type: 'file' | 'link' }>;
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
  const [studentProgresses, setStudentProgresses] = useState<StudentProgress[]>([]);
  const [loadingProgresses, setLoadingProgresses] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  console.log('🔍 LessonList: Component rendered:', {
    userRole: user?.role,
    userId: user?._id,
    lessonsCount: lessons?.length,
    isLoading,
    error
  });

  // Загружаем прогресс ученика
  useEffect(() => {
    console.log('🔍 LessonList: useEffect triggered:', {
      userRole: user?.role,
      userId: user?._id,
      willLoadProgress: user?._id
    });
    
    if (user?._id) {
      console.log('Loading progress for user:', user._id);
      loadStudentProgresses();
    } else {
      // Для неавторизованных пользователей сразу помечаем данные как готовые
      console.log('🔍 LessonList: No user ID, skipping progress loading');
      setIsDataReady(true);
    }
  }, [user?._id, user?.role]);

  const loadStudentProgresses = async () => {
    if (!user?._id) return;
    
    console.log('Starting to load user progresses...');
    setLoadingProgresses(true);
    setIsDataReady(false);
    
    try {
      const data = await fetchStudentProgress(user._id);
      console.log('Loaded user progresses:', data);
      
      // Если прогресс пустой, создаем записи по умолчанию для всех уроков
      if (data.length === 0 && lessons && lessons.length > 0) {
        console.log('No progress found, creating default progress for lessons');
        const defaultProgresses = lessons.map(lesson => {
          const defaultProgress = {
            _id: `${user._id}-${lesson._id}`,
            lessonId: lesson._id,
            attended: false
          };
          console.log('Created default progress for lesson:', {
            lessonId: lesson._id,
            lessonTitle: lesson.title,
            userRole: user?.role
          });
          return defaultProgress;
        });
        setStudentProgresses(defaultProgresses);
      } else {
        setStudentProgresses(data);
      }
    } catch (error) {
      console.error('Error loading user progresses:', error);
      // В случае ошибки создаем записи по умолчанию
      if (lessons && lessons.length > 0) {
        console.log('Creating default progress due to error');
        const defaultProgresses = lessons.map(lesson => {
          const defaultProgress = {
            _id: `${user._id}-${lesson._id}`,
            lessonId: lesson._id,
            attended: false
          };
          console.log('Created default progress (error case) for lesson:', {
            lessonId: lesson._id,
            lessonTitle: lesson.title,
            userRole: user?.role
          });
          return defaultProgress;
        });
        setStudentProgresses(defaultProgresses);
      } else {
        setStudentProgresses([]);
      }
    } finally {
      setLoadingProgresses(false);
      // Даем небольшую задержку для загрузки расписания в LessonCard
      setTimeout(() => setIsDataReady(true), 500);
    }
  };

  // Фильтрация по ролям
  let filteredLessons = lessons;
  let filteredProgresses = progresses;
  if (user?.role === 'guest') {
    filteredLessons = lessons?.filter(l => l.orderNumber === 1) || [];
  } else if (user?.role === 'student') {
    // Для студентов используем их собственный прогресс
    filteredProgresses = studentProgresses;
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

  // Показываем скелетон пока загружаются уроки ИЛИ прогресс ИЛИ данные еще не готовы
  if (isLoading || loadingProgresses || !isDataReady) {
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

  if (!filteredLessons || filteredLessons.length === 0) {
    return (
      <div className="lesson-list lesson-list--empty">
        <h3>Уроки не найдены</h3>
        <p>Пока что нет доступных уроков для изучения</p>
      </div>
    );
  }

  return (
    <div className="lesson-list">
      {filteredLessons?.map((lesson) => {
        const progress = filteredProgresses?.find(p => {
          // lessonId может быть строкой, объектом с _id или null
          if (!p.lessonId) return false;
          const progressLessonId = typeof p.lessonId === 'object' ? p.lessonId._id : p.lessonId;
          return progressLessonId === lesson._id;
        });
        
        return (
          <div key={lesson._id} style={{ position: 'relative' }}>
            <LessonCard lesson={lesson} progress={progress} />
          </div>
        );
      })}
    </div>
  );
}; 