const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Імпорт маршрутів
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

// === Підключення маршрутів ===
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'HotelHub API is running!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер успішно запущено на порту ${PORT}`);
});