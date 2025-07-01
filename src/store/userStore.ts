import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  isEmailVerified: boolean;
  subscription?: string;
  teacherId?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  selectedStudentId?: string | null;
  setSelectedStudent: (id: string | null) => void;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  refreshUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
      selectedStudentId: null,
      setSelectedStudent: (id) => set({ selectedStudentId: id }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        selectedStudentId: null
      }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      refreshUser: async () => {
        const state = useUserStore.getState();
        if (!state.user?._id) return;
        
        try {
          const { fetchCurrentUser } = await import('@/lib/api');
          const userData = await fetchCurrentUser(state.user._id);
          
          if (userData.exists && userData.user) {
            set({ user: { ...state.user, ...userData.user } });
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated,
        selectedStudentId: state.selectedStudentId
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setInitialized(true);
          state.setLoading(false);
        }
      },
    }
  )
); 