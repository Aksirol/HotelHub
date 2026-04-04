import { create } from 'zustand';

// Описуємо, як виглядають дані нашого користувача (згідно з бекендом)
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'GUEST' | 'MANAGER' | 'ADMIN';
}

// Описуємо структуру нашого сховища
interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean; // Зручний прапорець для перевірки, чи авторизований користувач
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Створюємо саме сховище
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuth: false,
  
  // Функція для збереження даних після успішного входу
  setAuth: (user, token) => {
    // Зберігаємо токен у localStorage, щоб наш apiClient міг його брати для запитів
    localStorage.setItem('hotelhub_token', token);
    
    // Оновлюємо глобальний стан
    set({ user, token, isAuth: true });
  },
  
  // Функція для виходу з системи
  logout: () => {
    localStorage.removeItem('hotelhub_token');
    set({ user: null, token: null, isAuth: false });
  },
}));