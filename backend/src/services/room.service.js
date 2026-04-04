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
    async getAllRooms() {
        return await prisma.room.findMany({
            include: {
                room_type: true // Одразу підтягуємо інформацію про тип кімнати
            }
        });
    }
};

module.exports = roomService;