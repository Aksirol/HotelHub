// frontend/src/entities/room/ui/RoomCard.tsx
import type { Room } from '../../../shared/types/room';
import { Link } from 'react-router-dom';
import { Users, SquareActivity, Wifi, Tv } from 'lucide-react'; // Іконки

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  // Заглушка, якщо фото ще не завантажено
  const defaultImage = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Фото кімнати */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={room.image_url || defaultImage} 
          alt={room.room_type.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
          ₴{Number(room.price_per_night).toFixed(0)} / ніч
        </div>
      </div>

      {/* Інформація */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{room.room_type.name}</h3>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            № {room.number}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {room.room_type.description}
        </p>

        {/* Характеристики */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Users size={16} className="text-blue-500" />
            <span>До {room.room_type.capacity} гостей</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <SquareActivity size={16} className="text-blue-500" />
            <span>{room.room_type.area_sqm} м²</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Wifi size={16} className="text-blue-500" />
            <span>Безкоштовний Wi-Fi</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Tv size={16} className="text-blue-500" />
            <span>Smart TV</span>
          </div>
        </div>

        {/* Кнопка бронювання (притиснута до низу завдяки mt-auto) */}
        {/* Кнопка-посилання на детальну сторінку */}
        <Link 
          to={`/rooms/${room.id}`}
          className="mt-auto block text-center w-full bg-blue-50 text-blue-600 font-semibold py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
        >
          Переглянути деталі
        </Link>
      </div>
    </div>
  );
};