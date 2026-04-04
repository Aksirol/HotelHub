const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reviewService = {
    // === 1. Створення відгуку ===
    async createReview(user_id, data) {
        const { room_id, rating, comment } = data;

        // Перевіряємо, чи рейтинг знаходиться в межах від 1 до 5
        if (rating < 1 || rating > 5) {
            throw new Error('Рейтинг повинен бути від 1 до 5');
        }

        // Перевіряємо, чи гість дійсно проживав у цій кімнаті
        // Шукаємо бронювання цього користувача для цієї кімнати зі статусом COMPLETED
        const pastBooking = await prisma.booking.findFirst({
            where: {
                user_id: user_id,
                room_id: room_id,
                status: 'COMPLETED'
            }
        });

        if (!pastBooking) {
            throw new Error('Ви можете залишити відгук лише після завершення проживання в цій кімнаті (статус COMPLETED)');
        }

        // Перевіряємо, чи користувач вже залишав відгук на цю кімнату (опціонально)
        const existingReview = await prisma.review.findFirst({
            where: { user_id, room_id }
        });

        if (existingReview) {
            throw new Error('Ви вже залишили відгук для цієї кімнати');
        }

        // Створюємо запис у базі даних
        return await prisma.review.create({
            data: { user_id, room_id, rating, comment }
        });
    },

    // === 2. Отримання всіх відгуків для конкретної кімнати ===
    async getRoomReviews(room_id) {
        return await prisma.review.findMany({
            where: { room_id },
            include: {
                // Підтягуємо ім'я та прізвище автора відгуку
                user: { select: { first_name: true, last_name: true } } 
            },
            orderBy: { created_at: 'desc' } // Найновіші відгуки зверху
        });
    }
};

module.exports = reviewService;