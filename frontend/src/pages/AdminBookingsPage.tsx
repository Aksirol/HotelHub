import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../shared/api/bookingApi';
import { useAuthStore } from '../shared/store/authStore';
import { Loader2, Settings } from 'lucide-react';

export const AdminBookingsPage = () => {
  const { user, isAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Перевірка прав доступу
  useEffect(() => {
    if (!isAuth || (user?.role !== 'ADMIN' && user?.role !== 'MANAGER')) {
      navigate('/');
    }
  }, [isAuth, user, navigate]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: getAllBookings,
    enabled: isAuth && (user?.role === 'ADMIN' || user?.role === 'MANAGER'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
    },
    onError: () => {
      alert('Помилка при зміні статусу');
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold text-gray-900">Управління бронюваннями</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">ID / Клієнт</th>
                <th className="p-4 font-medium">Кімната</th>
                <th className="p-4 font-medium">Дати</th>
                <th className="p-4 font-medium">Сума</th>
                <th className="p-4 font-medium text-center">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-xs text-gray-400 mb-1">{booking.id.slice(0, 8)}...</div>
                    <div className="font-medium text-gray-900">ID клієнта: {booking.user_id.slice(0, 5)}...</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">№ {booking.room?.number}</div>
                    <div className="text-sm text-gray-500">{booking.room?.room_type?.name}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div>{new Date(booking.check_in).toLocaleDateString()} —</div>
                    <div>{new Date(booking.check_out).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 font-bold text-blue-600">
                    ₴{Number(booking.total_price).toFixed(0)}
                  </td>
                  <td className="p-4 text-center">
                    {/* Випадаючий список для зміни статусу */}
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      disabled={statusMutation.isPending}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"
                    >
                      <option value="PENDING">PENDING (Очікує)</option>
                      <option value="CONFIRMED">CONFIRMED (Підтверджено)</option>
                      <option value="CHECKED_IN">CHECKED_IN (Заселено)</option>
                      <option value="COMPLETED">COMPLETED (Завершено)</option>
                      <option value="CANCELLED">CANCELLED (Скасовано)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings?.length === 0 && (
            <div className="p-8 text-center text-gray-500">Бронювань поки немає.</div>
          )}
        </div>
      </div>
    </div>
  );
};