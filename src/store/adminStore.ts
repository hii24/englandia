import { create } from 'zustand';
import { api } from '@/lib/api';

export const useAdminStore = create((set, get) => ({
  students: [],
  teachers: [],
  loading: false,
  error: null as string | null,

  loadUsers: async () => {
    set({ loading: true, error: null });
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        api.get('/users?role=student,guest'),
        api.get('/users?role=teacher'),
      ]);
      set({ students: studentsRes.data, teachers: teachersRes.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  assignTeacher: async (studentId: string, teacherId: string) => {
    await api.patch(`/users/${studentId}`, { teacherId });
    await get().loadUsers();
  },
})); 