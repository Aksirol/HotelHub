// frontend/src/pages/RoomsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { getRooms } from '../shared/api/roomApi';
import { RoomCard } from '../entities/room/ui/RoomCard';
import { Loader2 } from 'lucide-react';

export const RoomsPage = () => {
  // Використовуємо React Query для запиту
  // Він сам керує станом isLoading та error!
  const { data: rooms, isLoading, isError } = useQuery({
    queryKey: ['rooms'], // Унікальний ключ для кешування на фронтенді
    queryFn: getRooms,   // Функція, яка робить запит
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-600">Завантажуємо найкращі номери...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-xl font-bold">Ой! Сталася помилка при завантаженні кімнат.</p>
        <p className="mt-2 text-gray-600">Перевірте підключення до сервера.</p>
      </div>
    );
  }

  // Фільтруємо лише активні кімнати (ті, що доступні для продажу)
  const activeRooms = rooms?.filter(room => room.is_active) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Каталог номерів</h1>
        <p className="text-gray-500 mt-2">Знайдіть ідеальний варіант для вашого відпочинку</p>
      </div>

      {activeRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xl text-gray-500">На жаль, зараз немає доступних кімнат.</p>
        </div>
      ) : (
        /* Сітка карток: 1 колонка на мобільних, 2 на планшетах, 3 на десктопах */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};