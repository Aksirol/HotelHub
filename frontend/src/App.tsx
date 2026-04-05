import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <--- Додали імпорти
import { MainLayout } from './app/layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { LoginPage } from './pages/LoginPage';
import { RoomDetailsPage } from './pages/RoomDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { RegisterPage } from './pages/RegisterPage';

// Створюємо клієнт для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Щоб запити не дублювалися при перемиканні вкладок браузера
      retry: 1, // Кількість спроб повторити запит при помилці
    },
  },
});

export const App = () => {
  return (
    // Огортаємо додаток у QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="rooms/:id" element={<RoomDetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="admin/bookings" element={<AdminBookingsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="*" element={<div className="text-center py-20 text-red-500 text-2xl font-bold">404 - Сторінку не знайдено</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};