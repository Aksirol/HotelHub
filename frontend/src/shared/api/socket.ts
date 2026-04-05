import { io } from 'socket.io-client';

// Підключаємося до нашого бекенду
export const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
  autoConnect: false, // Підключаємося тільки тоді, коли нам це дійсно треба
});