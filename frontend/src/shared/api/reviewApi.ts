import { apiClient } from './apiClient';
import type { Review } from '../types/review';

// Отримання відгуків для конкретної кімнати
export const getRoomReviews = async (roomId: string): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(`/reviews/room/${roomId}`);
  return response.data;
};

// Створення нового відгуку
export const createReview = async (data: { room_id: string; rating: number; comment: string }) => {
  const response = await apiClient.post('/reviews', data);
  return response.data;
};