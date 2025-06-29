export interface LessonMaterial {
  title: string;
  url: string;
  type: string;
  forStudent: boolean;
}

export interface LessonGame {
  title: string;
  iframeUrl: string;
  description: string;
  forStudent: boolean;
}

export interface Lesson {
  _id: string;
  orderNumber: number;
  title: string;
  description: string;
  videoUrl?: string;
  bunnyVideoId?: string;
  games?: LessonGame[];
  materials: LessonMaterial[];
  additionalMaterials: LessonMaterial[];
  homework: LessonMaterial[];
  lessonLink?: { title: string; url: string; forStudent?: boolean };
  isActive?: boolean;
  isArchived?: boolean;
  isLocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonProgress {
  lessonId: string;
  attended: boolean;
  attendanceDate?: string;
  attendanceConfirmedBy?: string;
  lessonLink?: { title: string; url: string; forStudent?: boolean };
  homework?: Array<{ title: string; url: string; type: 'file' | 'link' }>;
  status?: 'not_started' | 'in_progress' | 'completed';
}

export interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
} 