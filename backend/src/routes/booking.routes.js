const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { verifyToken, requireRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Усі маршрути тут захищені, гість повинен бути авторизованим
router.use(verifyToken);

// === Маршрути для гостей (GUEST, MANAGER, ADMIN) ===
// Створити бронювання
router.post('/', bookingController.createBooking);
// Подивитися свої бронювання
router.get('/my', bookingController.getMyBookings);

// === Маршрути для персоналу (MANAGER, ADMIN) ===
// Подивитися всі бронювання готелю
router.get('/all', requireRoles(['ADMIN', 'MANAGER']), bookingController.getAllBookings);

// Змінити статус бронювання (тільки для MANAGER та ADMIN)
// Використовуємо метод PATCH, оскільки ми частково оновлюємо ресурс
router.patch(
    '/:id/status', 
    requireRoles(['ADMIN', 'MANAGER']), 
    bookingController.updateStatus
);

module.exports = router;