import type { Room } from '../types/room';
import { apiClient } from './apiClient';

// Додаємо інтерфейс для фільтрів
export interface RoomFilters {
  guests?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  checkIn?: string;
  checkOut?: string;
}

// Оновлюємо функцію, щоб вона приймала фільтри
export const getRooms = async (filters?: RoomFilters): Promise<Room[]> => {
  // Axios автоматично перетворить об'єкт params у рядок ?guests=2&minPrice=...
  const response = await apiClient.get<Room[]>('/rooms', { params: filters });
  return response.data;
};

export const getRoomById = async (id: string): Promise<Room> => {
  const response = await apiClient.get<Room>(`/rooms/${id}`);
  return response.data;
};