import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRooms, type RoomFilters } from '../shared/api/roomApi';
import { RoomCard } from '../entities/room/ui/RoomCard';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';

export const RoomsPage = () => {
  // Стан для зберігання значень форми
  const [filters, setFilters] = useState<RoomFilters>({});
  
  // Стан для тимчасових значень (поки користувач не натиснув "Шукати")
  const [localFilters, setLocalFilters] = useState<RoomFilters>({});

  // React Query буде автоматично перезбирати дані, якщо зміниться об'єкт filters
  const { data: rooms, isLoading, isError } = useQuery({
    queryKey: ['rooms', filters], 
    queryFn: () => getRooms(filters),
  });

  // Отримуємо сьогоднішню дату для обмеження календаря
  const today = new Date().toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // При натисканні "Шукати" оновлюємо головний стан фільтрів
    setFilters(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    setFilters({});
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Каталог номерів</h1>
        <p className="text-gray-500 mt-2">Знайдіть ідеальний варіант для вашого відпочинку</p>
      </div>

      {/* ПАНЕЛЬ ФІЛЬТРІВ */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          Фільтри пошуку
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Заїзд</label>
            <input 
              type="date" 
              min={today}
              value={localFilters.checkIn || ''}
              onChange={(e) => setLocalFilters({...localFilters, checkIn: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Виїзд</label>
            <input 
              type="date" 
              min={localFilters.checkIn || today}
              value={localFilters.checkOut || ''}
              onChange={(e) => setLocalFilters({...localFilters, checkOut: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Гостей</label>
            <select 
              value={localFilters.guests || ''}
              onChange={(e) => setLocalFilters({...localFilters, guests: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Будь-яка кількість</option>
              <option value="1">1 гість</option>
              <option value="2">Від 2 гостей</option>
              <option value="3">Від 3 гостей</option>
              <option value="4">Від 4 гостей</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Мін. ціна (₴)</label>
            <input 
              type="number" 
              placeholder="0"
              value={localFilters.minPrice || ''}
              onChange={(e) => setLocalFilters({...localFilters, minPrice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Макс. ціна (₴)</label>
            <input 
              type="number" 
              placeholder="100000"
              value={localFilters.maxPrice || ''}
              onChange={(e) => setLocalFilters({...localFilters, maxPrice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={handleReset}
            className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors"
          >
            Скинути
          </button>
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Шукати
          </button>
        </div>
      </form>

      {/* РЕЗУЛЬТАТИ ПОШУКУ */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-600">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-600">Шукаємо кімнати...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          <p className="text-xl font-bold">Ой! Сталася помилка при завантаженні кімнат.</p>
        </div>
      ) : rooms?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xl font-bold text-gray-800 mb-2">За вашим запитом нічого не знайдено</p>
          <p className="text-gray-500 mb-6">Спробуйте змінити дати, зменшити кількість гостей або розширити діапазон цін.</p>
          <button onClick={handleReset} className="text-blue-600 font-medium hover:underline">
            Скинути фільтри
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};