const hotelEmitter = require('../utils/eventEmitter');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bookingService = {
    // === 1. Створення бронювання (для Гостя) ===
    async createBooking(user_id, data) {
        const { room_id, check_in, check_out, guests_count } = data;

        // Перетворюємо рядки з датами у формат Date
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        // Перевіряємо логіку дат: виїзд має бути пізніше заїзд
        if (checkOutDate <= checkInDate) {
            throw new Error('Дата виїзду має бути пізніше дати заїзду');
        }

        // 1. Отримуємо інформацію про кімнату
        const room = await prisma.room.findUnique({
            where: { id: room_id },
            include: { room_type: true }
        });

        if (!room) throw new Error('Кімнату не знайдено');
        if (!room.is_active) throw new Error('Ця кімната наразі недоступна для бронювання');
        if (guests_count > room.room_type.capacity) {
            throw new Error(`Максимальна кількість гостей для цієї кімнати: ${room.room_type.capacity}`);
        }

        // 2. ПЕРЕВІРКА ДОСТУПНОСТІ (Overlapping dates)
        // Шукаємо бронювання для цієї кімнати, які перетинаються з нашими датами
        // і статус яких НЕ є "CANCELLED"
        const conflictingBookings = await prisma.booking.findMany({
            where: {
                room_id: room_id,
                status: { not: 'CANCELLED' },
                AND: [
                    { check_in: { lt: checkOutDate } },
                    { check_out: { gt: checkInDate } }
                ]
            }
        });

        if (conflictingBookings.length > 0) {
            throw new Error('Ця кімната вже заброньована на обрані дати');
        }

        // 3. Підрахунок загальної вартості
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const total_price = diffDays * Number(room.price_per_night);

        // 4. Створення запису в базі даних
        const newBooking = await prisma.booking.create({
            data: {
                user_id,
                room_id,
                check_in: checkInDate,
                check_out: checkOutDate,
                guests_count,
                total_price,
                status: 'PENDING'
            }
        });

        // Отримуємо email користувача для відправки листа
        const user = await prisma.user.findUnique({ where: { id: user_id } });

        // ВИПУСКАЄМО ПОДІЮ (Publisher)
        hotelEmitter.emit('booking_created', {
            email: user.email,
            booking: newBooking,
            roomNumber: room.number
        });

        return newBooking;
    },

    // === 2. Отримання бронювань конкретного користувача (Мій кабінет) ===
    async getUserBookings(user_id) {
        return await prisma.booking.findMany({
            where: { user_id },
            include: { room: true }, // Підтягуємо дані кімнати
            orderBy: { created_at: 'desc' }
        });
    },

    // === 3. Отримання всіх бронювань (для Адміна/Менеджера) ===
    async getAllBookings() {
        return await prisma.booking.findMany({
            include: { 
                user: { select: { first_name: true, last_name: true, email: true } },
                room: true 
            },
            orderBy: { created_at: 'desc' }
        });
    },

    // === 4. Оновлення статусу бронювання (для Менеджера/Адміна) ===
    async updateBookingStatus(booking_id, new_status) {
        // Перевіряємо, чи існує таке бронювання
        const booking = await prisma.booking.findUnique({
            where: { id: booking_id }
        });

        if (!booking) {
            throw new Error('Бронювання не знайдено');
        }

        // Перевіряємо, чи переданий статус є валідним (згідно з нашим enum в БД)
        const validStatuses = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(new_status)) {
            throw new Error('Недійсний статус бронювання');
        }

        // Оновлюємо статус
        return await prisma.booking.update({
            where: { id: booking_id },
            data: { status: new_status }
        });
    }
};

module.exports = bookingService;