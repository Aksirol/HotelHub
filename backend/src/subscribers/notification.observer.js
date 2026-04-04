// backend/src/subscribers/notification.observer.js
const hotelEmitter = require('../utils/eventEmitter');
const emailService = require('../services/email.service');

// ПАТЕРН OBSERVER: Підписуємося на подію 'booking_created'
hotelEmitter.on('booking_created', async (payload) => {
    console.log(`[Observer] Отримано подію 'booking_created' для користувача: ${payload.email}`);
    
    // Викликаємо сервіс відправки
    await emailService.sendBookingConfirmation(
        payload.email, 
        payload.booking, 
        payload.roomNumber
    );
});

module.exports = hotelEmitter; // Експортуємо просто для ініціалізації