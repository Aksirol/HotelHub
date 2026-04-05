import type { Room } from '../types/room';
import { apiClient } from './apiClient';

export const getRooms = async (): Promise<Room[]> => {
  const response = await apiClient.get<Room[]>('/rooms');
  return response.data;
};

export const getRoomById = async (id: string): Promise<Room> => {
  const response = await apiClient.get<Room>(`/rooms/${id}`);
  return response.data;
};