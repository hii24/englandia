export interface LessonMaterial {
  title: string;
  url: string;
  type: 'file' | 'link';
  forStudent?: boolean;
}

export interface Lesson {
  _id: string;
  orderNumber: number;
  title: string;
  description: string;
  videoUrl?: string;
  materials: LessonMaterial[];
  additionalMaterials: LessonMaterial[];
  homework: LessonMaterial[];
  lessonLink?: { title: string; url: string; forStudent?: boolean };
  isActive?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
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