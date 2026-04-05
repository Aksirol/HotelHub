import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../shared/api/apiClient';
import { Loader2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      
      // Відправляємо дані на наш безпечний маршрут
      await apiClient.post('/auth/register', data);
      
      alert('Реєстрація успішна! Тепер ви можете увійти в систему.');
      navigate('/login'); // Перекидаємо на сторінку логіну
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Сталася помилка під час реєстрації');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Створення акаунту</h1>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
            <input 
              type="text" 
              {...register('first_name', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Іван"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Прізвище</label>
            <input 
              type="text" 
              {...register('last_name', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Франко"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Телефон (необов'язково)</label>
          <input 
            type="tel" 
            {...register('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+380..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="mail@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            {...register('password', { required: true, minLength: 6 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Мінімум 6 символів"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:bg-blue-400"
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Вже маєте акаунт?{' '}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Увійти
        </Link>
      </div>
    </div>
  );
};