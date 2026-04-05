export interface Review {
  id: string;
  user_id: string;
  room_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}