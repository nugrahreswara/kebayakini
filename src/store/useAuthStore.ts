import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Simple auth - replace with real authentication in production
const ADMIN_CREDENTIALS = {
  email: 'admin@kebayaku.com',
  password: 'admin123',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminEmail: null,

      login: (email: string, password: string) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ isAuthenticated: true, adminEmail: email });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, adminEmail: null });
      },
    }),
    {
      name: 'kebayaku-auth',
    }
  )
);
