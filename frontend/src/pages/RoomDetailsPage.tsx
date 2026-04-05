import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRoomById } from '../shared/api/roomApi';
import { BookRoomForm } from '../features/booking/ui/BookRoomForm';
import { RoomReviews } from '../widgets/reviews/ui/RoomReviews';
import { Loader2, ArrowLeft, Users, SquareActivity, Wifi, Tv } from 'lucide-react';

export const RoomDetailsPage = () => {
  // Отримуємо ID кімнати з URL-адреси (наприклад, /rooms/123 -> id = 123)
  const { id } = useParams<{ id: string }>();

  // Завантажуємо дані кімнати
  const { data: room, isLoading, isError } = useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoomById(id as string),
    enabled: !!id, // Запит виконається лише якщо є id
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-blue-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg font-medium">Завантажуємо інформацію про номер...</p>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-xl font-bold">Помилка! Кімнату не знайдено.</p>
        <Link to="/rooms" className="text-blue-500 hover:underline mt-4 inline-block">
          Повернутися до каталогу
        </Link>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Кнопка "Назад" */}
      <Link to="/rooms" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад до всіх номерів
      </Link>

      {/* Головний блок з фото та інфо */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Фото */}
        <div className="h-64 md:h-96 w-full overflow-hidden">
          <img 
            src={room.image_url || defaultImage} 
            alt={room.room_type.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 md:flex gap-8">
          {/* Ліва колонка (Опис) */}
          <div className="md:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{room.room_type.name}</h1>
              <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-lg font-bold text-lg border border-gray-200">
                № {room.number}
              </span>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {room.room_type.description}
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Зручності у номері:</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-500 mr-3" />
                <span>До {room.room_type.capacity} гостей</span>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <SquareActivity className="w-5 h-5 text-blue-500 mr-3" />
                <span>Площа: {room.room_type.area_sqm} м²</span>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <Wifi className="w-5 h-5 text-blue-500 mr-3" />
                <span>Безкоштовний Wi-Fi</span>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <Tv className="w-5 h-5 text-blue-500 mr-3" />
                <span>Smart TV</span>
              </div>
            </div>
          </div>

          {/* Права колонка (Блок бронювання) */}
          <div className="md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
              <div className="text-3xl font-extrabold text-blue-600 mb-2">
                ₴{Number(room.price_per_night).toFixed(0)}
                <span className="text-base font-normal text-gray-500"> / ніч</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              
              <BookRoomForm roomId={room.id} pricePerNight={Number(room.price_per_night)} />
              
            </div>
          </div>
        </div>
      </div>

      {/* НОВИЙ БЛОК ВІДГУКІВ ТУТ */}
      <RoomReviews roomId={room.id} />

    </div>
  );
};