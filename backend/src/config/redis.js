const redis = require('redis');

// Створюємо клієнт (за замовчуванням він підключається до localhost:6379,
// що ідеально збігається з налаштуваннями нашого docker-compose)
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

// Обробка помилок та подій підключення
redisClient.on('error', (err) => console.error('Помилка підключення до Redis:', err));
redisClient.on('connect', () => console.log('📦 Успішне підключення до Redis'));

// Ініціалізуємо підключення
redisClient.connect().catch(console.error);

module.exports = redisClient;