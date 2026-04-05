import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getRoomReviews, createReview } from '../../../shared/api/reviewApi';
import { useAuthStore } from '../../../shared/store/authStore';
import { Star, MessageSquare } from 'lucide-react';

interface RoomReviewsProps {
  roomId: string;
}

interface ReviewFormForm {
  rating: number;
  comment: string;
}

export const RoomReviews = ({ roomId }: RoomReviewsProps) => {
  const { isAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ReviewFormForm>({
    defaultValues: { rating: 5 }
  });

  // Завантажуємо відгуки
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', roomId],
    queryFn: () => getRoomReviews(roomId),
  });

  // Мутація для відправки відгуку
  const mutation = useMutation({
    mutationFn: (data: ReviewFormForm) => createReview({ room_id: roomId, ...data }),
    onSuccess: () => {
      // Оновлюємо список відгуків
      queryClient.invalidateQueries({ queryKey: ['reviews', roomId] });
      reset(); // Очищаємо форму
      alert('Дякуємо! Ваш відгук успішно додано.');
    },
    onError: (error: any) => {
      // Виводимо помилку з бекенду (наприклад, якщо статус не COMPLETED)
      alert(error.response?.data?.error || 'Помилка при додаванні відгуку');
    }
  });

  const onSubmit = (data: ReviewFormForm) => {
    mutation.mutate(data);
  };

  // Функція для малювання зірочок
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-600" />
        Відгуки гостей
      </h3>

      {/* Форма для нового відгуку (тільки для авторизованих) */}
      {isAuth ? (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
          <h4 className="font-bold text-gray-800 mb-4">Залишити відгук</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Оцінка</label>
            <select 
              {...register('rating', { valueAsNumber: true })}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={5}>5 - Відмінно</option>
              <option value={4}>4 - Дуже добре</option>
              <option value={3}>3 - Нормально</option>
              <option value={2}>2 - Погано</option>
              <option value={1}>1 - Жахливо</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ваш коментар</label>
            <textarea 
              {...register('comment', { required: true })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Розкажіть про свої враження..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {mutation.isPending ? 'Відправка...' : 'Опублікувати відгук'}
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 mb-8 text-center border border-blue-100">
          Увійдіть в систему, щоб залишити відгук.
        </div>
      )}

      {/* Список відгуків */}
      {isLoading ? (
        <p className="text-gray-500">Завантаження відгуків...</p>
      ) : reviews?.length === 0 ? (
        <p className="text-gray-500 text-center py-8 bg-white border border-gray-100 rounded-xl">
          Для цієї кімнати ще немає відгуків. Будьте першим!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-bold text-gray-900">
                    {review.user?.first_name} {review.user?.last_name}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};