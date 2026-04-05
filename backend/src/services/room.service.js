const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const roomService = {
    // === 1. Створення типу кімнати (для Адміна) ===
    async createRoomType(data) {
        const { name, capacity, description, area_sqm, amenities } = data;
        return await prisma.roomType.create({
            data: { name, capacity, description, area_sqm, amenities }
        });
    },

    // === 2. Отримання всіх типів кімнат ===
    async getAllRoomTypes() {
        return await prisma.roomType.findMany();
    },

    // === 3. Створення конкретної кімнати (для Адміна) ===
    async createRoom(data) {
        const { room_type_id, number, floor, price_per_night } = data;
        
        // Перевіряємо, чи існує такий номер
        const existingRoom = await prisma.room.findUnique({ where: { number } });
        if (existingRoom) {
            throw new Error('Кімната з таким номером вже існує');
        }

        return await prisma.room.create({
            data: { room_type_id, number, floor, price_per_night }
        });
    },

    // === 4. Отримання всіх кімнат (для каталогу на Frontend) ===
    // Отримання всіх кімнат з підтримкою фільтрів
    async getAllRooms(filters = {}) {
        const { guests, minPrice, maxPrice, checkIn, checkOut } = filters;

        // Базове правило: кімната має бути активною
        let whereClause = { is_active: true };

        // 1. Фільтр за кількістю гостей (зв'язок з таблицею RoomType)
        if (guests) {
            whereClause.room_type = {
                capacity: { gte: parseInt(guests) } // gte - Greater Than or Equal (Більше або дорівнює)
            };
        }

        // 2. Фільтр за ціною
        if (minPrice || maxPrice) {
            whereClause.price_per_night = {};
            if (minPrice) whereClause.price_per_night.gte = parseFloat(minPrice);
            if (maxPrice) whereClause.price_per_night.lte = parseFloat(maxPrice);
        }

        // 3. Фільтр за доступністю дат (найкрутіша частина)
        // Шукаємо кімнати, у яких НЕМАЄ бронювань, що перетинаються з нашими датами
        if (checkIn && checkOut) {
            whereClause.bookings = {
                none: {
                    status: { in: ['CONFIRMED', 'CHECKED_IN', 'PENDING'] },
                    OR: [
                        {
                            // Перетин дат: заїзд нового раніше за виїзд старого, 
                            // і виїзд нового пізніше за заїзд старого
                            check_in: { lt: new Date(checkOut) },
                            check_out: { gt: new Date(checkIn) }
                        }
                    ]
                }
            };
        }

        return await prisma.room.findMany({
            where: whereClause,
            include: { room_type: true },
            orderBy: { price_per_night: 'asc' } // Сортуємо від найдешевших
        });
    },

    // === 5. Оновлення фотографії кімнати ===
    async updateRoomImage(roomId, imageUrl) {
        return await prisma.room.update({
            where: { id: roomId },
            data: { image_url: imageUrl }
        });
    },

    // Отримання однієї кімнати за ID
    async getRoomById(id) {
        return await prisma.room.findUnique({
            where: { id },
            include: { room_type: true } // Підтягуємо дані про тип кімнати
        });
    }
};

module.exports = roomService;