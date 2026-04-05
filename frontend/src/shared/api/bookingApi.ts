import { apiClient } from './apiClient';
import type { Booking } from '../types/booking';

// Описуємо, які дані ми відправляємо на сервер
export interface CreateBookingDto {
  room_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
}

// Описуємо функцію запиту
export const createBooking = async (data: CreateBookingDto) => {
  const response = await apiClient.post('/bookings', data);
  return response.data;
}

// Отримання бронювань поточного користувача
export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/bookings/my');
  return response.data;
};