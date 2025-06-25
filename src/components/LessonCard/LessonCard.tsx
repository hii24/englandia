import React from 'react';
import { LessonCardProps } from './LessonCard.types';
import { LessonCardStudentView } from './LessonCardStudentView';
import { LessonCardTeacherView } from './LessonCardTeacherView';
import { LessonCardAdminView } from './LessonCardAdminView';
import { LessonCardGuestView } from './LessonCardGuestView';
import { useUserStore } from '../../store/userStore';
import './LessonCard.scss';

export const LessonCard: React.FC<LessonCardProps> = (props) => {
  const user = useUserStore((s) => s.user);
  const role = user?.role || 'guest';
  if (role === 'student') return <LessonCardStudentView {...props} />;
  if (role === 'teacher') return <LessonCardTeacherView {...props} />;
  if (role === 'admin') return <LessonCardAdminView {...props} />;
  return <LessonCardGuestView {...props} />;
}; 