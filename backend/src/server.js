const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http'); // 1. Імпортуємо вбудований модуль http
const { Server } = require('socket.io'); // 2. Імпортуємо Server з socket.io
require('dotenv').config();

const { apiLimiter, authLimiter } = require('./middlewares/rateLimiter');
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('./subscribers/notification.observer'); 

const app = express();
const PORT = process.env.PORT || 5000;

// === НАЛАШТУВАННЯ HTTP ТА WEBSOCKET СЕРВЕРА ===
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Дозволяємо підключення з нашого фронтенду
        methods: ["GET", "POST", "PATCH"]
    }
});

// Зберігаємо io в об'єкті app, щоб мати до нього доступ з контролерів
app.set('io', io);

// Логіка підключення клієнтів
io.on('connection', (socket) => {
    console.log('🟢 Клієнт підключився до WebSocket:', socket.id);

    // Дозволяємо адмінам приєднатися до спеціальної "кімнати" сповіщень
    socket.on('join_admin_room', () => {
        socket.join('admin_room');
        console.log('👔 Адміністратор приєднався до кімнати: admin_room');
    });

    socket.on('disconnect', () => {
        console.log('🔴 Клієнт відключився:', socket.id);
    });
});

// === БАЗОВА БЕЗПЕКА ===
app.use(helmet()); 
app.use('/api', apiLimiter); 
app.use('/api/auth', authLimiter); 

// === Мідлвари ===
app.use(cors()); 
app.use(express.json()); 

// === Маршрути ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// Запускаємо SERVER замість APP
server.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
    console.log(`Документація доступна за адресою: http://localhost:${PORT}/api-docs`);
});