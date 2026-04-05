import type { Room } from './room';

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: string | number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  room?: Room; // Підтягнута інформація про кімнату з бекенду
}