import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getMyBookings } from '../shared/api/bookingApi';
import { useAuthStore } from '../shared/store/authStore';
import { Loader2, Calendar, CreditCard, Clock } from 'lucide-react';

export const DashboardPage = () => {
  const { user, isAuth } = useAuthStore();
  const navigate = useNavigate();

  // Захист сторінки: якщо гість не авторизований, перенаправляємо на логін
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  // Отримуємо бронювання
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: getMyBookings,
    enabled: isAuth, // Робимо запит тільки якщо користувач авторизований
  });

  if (!isAuth || !user) return null;

  // Функція для красивого форматування статусу
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Очікує оплати' },
      CONFIRMED: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Підтверджено' },
      CHECKED_IN: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Проживає' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Завершено' },
      CANCELLED: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Скасовано' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Особистий кабінет</h1>
        <p className="text-gray-500 text-lg">
          Вітаємо, <span className="font-semibold text-gray-800">{user.first_name} {user.last_name}</span>!
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="text-blue-600" />
        Ваші бронювання
      </h2>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Помилка при завантаженні бронювань. Спробуйте пізніше.
        </div>
      )}

      {bookings?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">У вас ще немає бронювань</h3>
          <p className="text-gray-500 mb-6">Саме час знайти ідеальний номер для відпочинку!</p>
          <Link to="/rooms" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Перейти до каталогу
          </Link>
        </div>
      )}

      <div className="grid gap-6">
        {bookings?.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {booking.room?.room_type?.name || 'Кімната'}
                </h3>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  № {booking.room?.number || '---'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4">
                <div><span className="text-gray-400">Заїзд:</span> {new Date(booking.check_in).toLocaleDateString()}</div>
                <div><span className="text-gray-400">Виїзд:</span> {new Date(booking.check_out).toLocaleDateString()}</div>
                <div><span className="text-gray-400">Гостей:</span> {booking.guests_count}</div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="text-right w-full">
                <div className="text-sm text-gray-500 mb-1">Загальна сума</div>
                <div className="text-2xl font-bold text-blue-600">
                  ₴{Number(booking.total_price).toFixed(0)}
                </div>
              </div>
              
              <div className="w-full flex justify-end">
                {getStatusBadge(booking.status)}
              </div>

              {/* Кнопка оплати буде доступна тільки якщо статус PENDING */}
              {booking.status === 'PENDING' && (
                <button className="w-full md:w-auto mt-2 bg-green-50 text-green-600 font-semibold px-4 py-2 rounded-lg border border-green-200 hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Оплатити
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};