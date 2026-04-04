const rateLimit = require('express-rate-limit');

// === 1. Загальний ліміт для всього API ===
// Дозволяє 100 запитів з однієї IP-адреси кожні 15 хвилин
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, 
    message: {
        error: 'Забагато запитів з вашої IP-адреси. Будь ласка, спробуйте пізніше через 15 хвилин.'
    },
    standardHeaders: true, // Повертає інфо про ліміти в заголовках RateLimit-*
    legacyHeaders: false, // Вимикає старі заголовки X-RateLimit-*
});

// === 2. Суворий ліміт для авторизації ===
// Дозволяє лише 10 спроб входу/реєстрації на годину
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 година
    max: 10,
    message: {
        error: 'Забагато спроб авторизації. З метою безпеки ваш доступ тимчасово обмежено на 1 годину.'
    }
});

module.exports = { apiLimiter, authLimiter };