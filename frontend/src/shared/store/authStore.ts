import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'GUEST' | 'MANAGER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Обертаємо наш store у persist
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuth: false,
      
      setAuth: (user, token) => {
        // Залишаємо це для нашого apiClient
        localStorage.setItem('hotelhub_token', token);
        set({ user, token, isAuth: true });
      },
      
      logout: () => {
        localStorage.removeItem('hotelhub_token');
        set({ user: null, token: null, isAuth: false });
      },
    }),
    {
      // Ім'я ключа, під яким Zustand зберігатиме весь свій стан у браузері
      name: 'auth-storage', 
    }
  )
);