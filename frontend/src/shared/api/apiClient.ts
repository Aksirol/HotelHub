import axios from 'axios';

// 1. Створюємо базовий екземпляр Axios
// Він автоматично братиме адресу нашого бекенду зі змінних оточення
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor ЗАПИТІВ (Request)
// Ця функція запускається ПЕРЕД тим, як запит полетить на сервер.
// Тут ми автоматично "приклеюємо" наш JWT-токен до заголовків.
apiClient.interceptors.request.use(
    (config) => {
        // Поки що ми будемо зберігати токен у звичайному localStorage браузера.
        // Згодом ми інтегруємо це зі стейт-менеджером Zustand.
        const token = localStorage.getItem('hotelhub_token');
        
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor ВІДПОВІДЕЙ (Response)
// Ця функція перехоплює відповідь від сервера ПЕРЕД тим, як її отримає наш компонент.
// Це ідеальне місце для глобальної обробки помилок (наприклад, коли токен прострочився).
apiClient.interceptors.response.use(
    (response) => {
        // Якщо все добре, просто віддаємо дані далі
        return response;
    },
    (error) => {
        // Якщо бекенд відповів статусом 401 (Неавторизовано)
        if (error.response?.status === 401) {
            console.error('Помилка авторизації. Токен недійсний або прострочений.');
            // Видаляємо зламаний токен
            localStorage.removeItem('hotelhub_token');
            
            // Якщо користувач не на сторінці логіну, можемо примусово його туди перенаправити
            // window.location.href = '/login'; 
        }
        
        return Promise.reject(error);
    }
);