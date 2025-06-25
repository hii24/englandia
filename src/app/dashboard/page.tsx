'use client';

import AuthGuard from '@/components/AuthGuard';
import { LessonList } from '@/components/LessonList';
import { Lesson, LessonProgress } from '@/components/LessonCard';

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Insects',
    description: 'Учим названия насекомых и их особенности',
    orderNumber: 1,
    materials: [
      { url: '/files/insects.pdf', type: 'file' },
    ],
    additionalMaterials: [
      { url: 'https://youtube.com', type: 'link' },
    ],
    homework: [
      { url: '/files/insects-homework.pdf', type: 'file' },
    ],
    videoUrl: '',
  },
  {
    id: '2',
    title: 'Colors All Around Me',
    description: 'Цвета + окружающие предметы',
    orderNumber: 2,
    materials: [],
    additionalMaterials: [],
    homework: [],
    videoUrl: '',
  },
];

const mockProgress: LessonProgress[] = [
  { lessonId: '1', status: 'completed' },
  { lessonId: '2', status: 'not_started' },
];

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>
        <LessonList lessons={mockLessons} progresses={mockProgress} />
      </div>
    </AuthGuard>
  );
} 