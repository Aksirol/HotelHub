import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../shared/api/apiClient';
import { useAuthStore } from '../shared/store/authStore.ts';

export const LoginPage = () => {
  // Налаштовуємо хуки
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  // Локальний стан для обробки помилок
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ця функція викличеться, коли ми натиснемо "Увійти"
  const onSubmit = async (data: any) => {
    try {
      setErrorMsg(null); // Очищаємо старі помилки
      
      // Робимо реальний запит на наш бекенд
      const response = await apiClient.post('/auth/login', data);
      
      // Якщо все успішно, бекенд поверне нам токен та об'єкт user
      const { token, user } = response.data;
      
      // Зберігаємо їх у наш глобальний стан Zustand
      setAuth(user, token);
      
      // Перенаправляємо користувача на головну сторінку
      navigate('/');
    } catch (error: any) {
      // Якщо бекенд повернув помилку (наприклад, 401 Невірний пароль)
      setErrorMsg(error.response?.data?.error || 'Помилка під час входу');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Вхід у систему</h1>
      
      {/* Виведення повідомлення про помилку */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
          {errorMsg}
        </div>
      )}

      {/* Форма, яка контролюється react-hook-form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="test@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            {...register('password', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Увійти
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Ще не зареєстровані?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Створити акаунт
        </Link>
      </div>

    </div>
  );
};