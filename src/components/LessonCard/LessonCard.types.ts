export interface LessonMaterial {
  url: string;
  type: 'file' | 'link';
}

export interface Lesson {
  id: string;
  orderNumber: number;
  title: string;
  description: string;
  videoUrl?: string;
  materials: LessonMaterial[];
  additionalMaterials: LessonMaterial[];
  homework: LessonMaterial[];
}

export interface LessonProgress {
  lessonId: string;
  status: 'completed' | 'in_progress' | 'skipped' | 'not_started';
  completedAt?: string;
}

export interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
} 