import { create } from 'zustand';
import { api } from '@/lib/api';

interface AdminState {
  students: any[];
  teachers: any[];
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  assignTeacher: (studentId: string, teacherId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  students: [],
  teachers: [],
  loading: false,
  error: null,

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