// backend/src/services/payment.service.js
const { PrismaClient } = require('@prisma/client');
const paymentStrategies = require('../utils/payment.strategies');

const prisma = new PrismaClient();

const paymentService = {
    async processPayment(user_id, paymentData) {
        const { booking_id, method } = paymentData;

        // 1. Знаходимо бронювання та перевіряємо, чи воно належить цьому користувачу
        const booking = await prisma.booking.findUnique({
            where: { id: booking_id }
        });

        if (!booking) {
            throw new Error('Бронювання не знайдено');
        }
        if (booking.user_id !== user_id) {
            throw new Error('Ви не можете оплатити чуже бронювання');
        }
        if (booking.status !== 'PENDING') {
            throw new Error(`Бронювання вже має статус: ${booking.status}`);
        }

        // 2. Вибираємо стратегію оплати (Strategy Pattern)
        const strategy = paymentStrategies[method];
        if (!strategy) {
            throw new Error('Обраний метод оплати не підтримується');
        }

        // 3. Виконуємо "оплату" (викликаємо метод process нашої стратегії)
        const paymentResult = strategy.process(booking.total_price);

        if (!paymentResult.success) {
            throw new Error('Помилка під час обробки платежу');
        }

        // 4. Оновлюємо базу даних (використовуємо транзакцію для безпеки)
        // Транзакція гарантує, що якщо одна дія не вдасться, скасуються всі інші
        const result = await prisma.$transaction(async (prisma) => {
            
            // Створюємо запис про платіж
            const payment = await prisma.payment.create({
                data: {
                    booking_id: booking.id,
                    amount: booking.total_price,
                    method: method,
                    status: 'COMPLETED',
                    transaction_id: paymentResult.transaction_id,
                    paid_at: new Date()
                }
            });

            // Оновлюємо статус бронювання на CONFIRMED
            const updatedBooking = await prisma.booking.update({
                where: { id: booking.id },
                data: { status: 'CONFIRMED' }
            });

            return { payment, updatedBooking };
        });

        return result;
    }
};

module.exports = paymentService;