const roomService = require('../services/room.service');
const redisClient = require('../config/redis');

const roomController = {
    // === Отримання всіх кімнат (З КЕШУВАННЯМ) ===
    async getRooms(req, res) {
        try {
            const cacheKey = 'rooms:all';

            // 1. Перевіряємо, чи є дані в кеші Redis
            const cachedRooms = await redisClient.get(cacheKey);

            if (cachedRooms) {
                console.log('⚡ Дані отримано з кешу Redis');
                // Дані в Redis зберігаються як рядок, тому перетворюємо їх назад в об'єкт JSON
                return res.status(200).json(JSON.parse(cachedRooms));
            }

            // 2. Якщо в кеші пусто, беремо дані з PostgreSQL
            console.log('🗄️ Дані отримано з бази даних PostgreSQL');
            const rooms = await roomService.getAllRooms();

            // 3. Зберігаємо результат у Redis на 1 годину (3600 секунд)
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(rooms));

            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера' });
        }
    },

    // === Додавання кімнати (З ОЧИЩЕННЯМ КЕШУ) ===
    async createRoom(req, res) {
        try {
            const room = await roomService.createRoom(req.body);
            
            // Інвалідація кешу: видаляємо старий список, щоб нові гості побачили нову кімнату
            await redisClient.del('rooms:all');
            console.log('🧹 Кеш кімнат очищено');

            res.status(201).json({ message: 'Кімнату успішно додано', room });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // === Додавання типу кімнати ===
    async createType(req, res) {
        try {
            const roomType = await roomService.createRoomType(req.body);
            res.status(201).json({ message: 'Тип кімнати створено', roomType });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // === Отримання типів кімнат ===
    async getTypes(req, res) {
        try {
            const types = await roomService.getAllRoomTypes();
            res.status(200).json(types);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера' });
        }
    },

    // === Завантаження фото кімнати ===
    async uploadImage(req, res) {
        try {
            const { id } = req.params; // ID кімнати з URL
            
            // Якщо файл не завантажився
            if (!req.file) {
                return res.status(400).json({ error: 'Будь ласка, завантажте файл' });
            }

            // Шлях до файлу в Cloudinary автоматично зберігається в req.file.path
            const imageUrl = req.file.path;

            const updatedRoom = await roomService.updateRoomImage(id, imageUrl);

            // Очищаємо кеш Redis, щоб на фронтенді одразу з'явилося нове фото
            await redisClient.del('rooms:all');

            res.status(200).json({ 
                message: 'Фото успішно завантажено', 
                room: updatedRoom 
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = roomController;