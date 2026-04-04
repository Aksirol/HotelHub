import { Link, Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Шапка сайту (Header) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            HotelHub
          </Link>
          <nav className="flex gap-6">
            <Link to="/rooms" className="text-gray-600 hover:text-blue-600 font-medium">Кімнати</Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Увійти</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Кабінет</Link>
          </nav>
        </div>
      </header>

      {/* Основний контент (тут будуть рендеритися наші сторінки) */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      {/* Підвал (Footer) */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} HotelHub. Усі права захищені.
        </div>
      </footer>
    </div>
  );
};