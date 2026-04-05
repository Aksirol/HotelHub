import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createBooking, type CreateBookingDto } from '../../../shared/api/bookingApi';
import { useAuthStore } from '../../../shared/store/authStore';

interface BookRoomFormProps {
  roomId: string;
  pricePerNight: number;
}

export const BookRoomForm = ({ roomId, pricePerNight }: BookRoomFormProps) => {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  
  const [totalPrice, setTotalPrice] = useState(pricePerNight);
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateBookingDto>({
    defaultValues: { room_id: roomId, guests_count: 1 }
  });

  // Спостерігаємо за зміною дат у формі
  const checkInDate = watch('check_in');
  const checkOutDate = watch('check_out');

  // Отримуємо сьогоднішню дату у форматі YYYY-MM-DD для обмеження календаря
  const today = new Date().toISOString().split('T')[0];

  // Динамічний підрахунок вартості
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setTotalPrice(diffDays * pricePerNight);
      } else {
        setTotalPrice(pricePerNight);
      }
    }
  }, [checkInDate, checkOutDate, pricePerNight]);

  // Налаштування мутації (відправки даних)
  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setSuccessMsg('Бронювання успішно створено! Очікуйте на підтвердження.');
    }
  });

  const onSubmit = (data: CreateBookingDto) => {
    if (!isAuth) {
      // Якщо гість не авторизований, відправляємо його на сторінку логіну
      navigate('/login');
      return;
    }
    
    // Перевіряємо, чи дата виїзду більша за дату заїзду
    if (new Date(data.check_out) <= new Date(data.check_in)) {
      alert("Дата виїзду повинна бути пізніше дати заїзду");
      return;
    }

    mutation.mutate(data);
  };

  if (successMsg) {
    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-2">Успіх! 🎉</h3>
        <p className="text-green-600 mb-4">{successMsg}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Перейти в кабінет
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mutation.isError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {(mutation.error as any).response?.data?.error || 'Сталася помилка при бронюванні'}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Дата заїзду</label>
        <input 
          type="date" 
          min={today}
          {...register('check_in', { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Дата виїзду</label>
        <input 
          type="date" 
          min={checkInDate || today}
          {...register('check_out', { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Кількість гостей</label>
        <select 
          {...register('guests_count', { valueAsNumber: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value={1}>1 гість</option>
          <option value={2}>2 гостя</option>
          <option value={3}>3 гостя</option>
          <option value={4}>4 гостя</option>
        </select>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600 font-medium">Загальна сума:</span>
        <span className="text-2xl font-bold text-gray-900">₴{totalPrice.toFixed(0)}</span>
      </div>

      <button 
        type="submit" 
        disabled={mutation.isPending}
        className={`w-full font-bold py-3 rounded-xl transition-colors ${
          mutation.isPending 
            ? 'bg-blue-400 cursor-not-allowed text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {mutation.isPending ? 'Обробка...' : (isAuth ? 'Забронювати номер' : 'Увійдіть для бронювання')}
      </button>
    </form>
  );
};