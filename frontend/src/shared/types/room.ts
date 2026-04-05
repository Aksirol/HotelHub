// frontend/src/shared/types/room.ts

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  description: string;
  area_sqm: number;
  amenities: any; // Зручності (JSON)
}

export interface Room {
  id: string;
  room_type_id: string;
  number: string;
  floor: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  price_per_night: string | number; // З бекенду Decimal часто приходить як рядок
  is_active: boolean;
  image_url: string | null;
  room_type: RoomType; // Вкладений об'єкт з деталями типу кімнати
}