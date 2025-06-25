import { create } from 'zustand';
import { fetchLessons, createLesson, updateLesson, archiveLesson } from '@/lib/api';

interface LessonStore {
  lessons: any[];
  loading: boolean;
  error: string | null;
  loadLessons: () => Promise<void>;
  addLesson: (data: any) => Promise<void>;
  editLesson: (id: string, data: any) => Promise<void>;
  removeLesson: (id: string) => Promise<void>;
}

export const useLessonStore = create<LessonStore>((set, get) => ({
  lessons: [],
  loading: false,
  error: null,

  loadLessons: async () => {
    set({ loading: true, error: null });
    try {
      const lessons = await fetchLessons();
      set({ lessons, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  addLesson: async (data: any) => {
    await createLesson(data);
    await get().loadLessons();
  },

  editLesson: async (id: string, data: any) => {
    console.log('lessonStore.editLesson вызван с:', { id, data });
    await updateLesson(id, data);
    await get().loadLessons();
  },

  removeLesson: async (id: string) => {
    await archiveLesson(id);
    await get().loadLessons();
  }
})); 