import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './app/layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { LoginPage } from './pages/LoginPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Базовий маршрут, який містить MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* Вкладені маршрути (будуть рендеритися замість <Outlet />) */}
          <Route index element={<HomePage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="login" element={<LoginPage />} />
          
          {/* Сторінка для неіснуючих маршрутів */}
          <Route path="*" element={
            <div className="text-center py-20 text-red-500 text-2xl font-bold">
              404 - Сторінку не знайдено
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};