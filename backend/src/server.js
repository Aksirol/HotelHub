const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');

require('dotenv').config();
const { apiLimiter, authLimiter } = require('./middlewares/rateLimiter');
require('./subscribers/notification.observer');

// Імпорт маршрутів
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// === БАЗОВА БЕЗПЕКА (Security Layer) ===
app.use(helmet()); // Встановлює безпечні HTTP-заголовки
app.use('/api', apiLimiter); // Застосовує загальний ліміт до всіх маршрутів, що починаються з /api
app.use('/api/auth', authLimiter); // Застосовує суворий ліміт до логіну/реєстрації

// === Мідлвари (Middlewares) ===
app.use(cors()); 
app.use(express.json()); 

// === Підключення маршрутів ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'HotelHub API is running!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер успішно запущено на порту ${PORT}`);
});