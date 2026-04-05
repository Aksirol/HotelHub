import { apiClient } from './apiClient';

export const processPayment = async (booking_id: string, method: string = 'CREDIT_CARD') => {
  const response = await apiClient.post('/payments/process', {
    booking_id,
    method
  });
  return response.data;
};