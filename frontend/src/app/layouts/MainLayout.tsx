import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/store/authStore.ts';

export const MainLayout = () => {
  // Дістаємо дані зі сховища Zustand
  const { isAuth, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Очищаємо стан та токен
    navigate('/login'); // Перенаправляємо на сторінку входу
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            HotelHub
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/rooms" className="text-gray-600 hover:text-blue-600 font-medium">Кімнати</Link>
            
            {/* Умовний рендеринг: перевіряємо, чи авторизований користувач */}
            {isAuth ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Кабінет</Link>
                <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  {user?.first_name} {user?.last_name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Увійти
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} HotelHub. Усі права захищені.
        </div>
      </footer>
    </div>
  );
};