const bookingService = require('../services/booking.service');

const bookingController = {
    // Створення бронювання
    async createBooking(req, res) {
        try {
            // Беремо id користувача з токена, який розшифрував middleware
            const user_id = req.user.id; 
            const bookingData = req.body;

            const newBooking = await bookingService.createBooking(user_id, bookingData);
            
            res.status(201).json({
                message: 'Бронювання успішно створено',
                booking: newBooking
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Перегляд своїх бронювань
    async getMyBookings(req, res) {
        try {
            const user_id = req.user.id;
            const bookings = await bookingService.getUserBookings(user_id);
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера при отриманні бронювань' });
        }
    },

    // Отримання всіх бронювань
    async getAllBookings(req, res) {
        try {
            const bookings = await bookingService.getAllBookings();
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера при завантаженні бронювань' });
        }
    },

    // Зміна статусу бронювання персоналом
    async updateStatus(req, res) {
        try {
            const { id } = req.params; // Отримуємо ID бронювання з URL
            const { status } = req.body; // Отримуємо новий статус з тіла запиту

            const updatedBooking = await bookingService.updateBookingStatus(id, status);

            res.status(200).json({
                message: `Статус бронювання успішно змінено на ${status}`,
                booking: updatedBooking
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = bookingController;