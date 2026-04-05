const roomService = require('../services/room.service');
const redisClient = require('../config/redis');

const roomController = {
    // === Отримання всіх кімнат (З КЕШУВАННЯМ ТА РОЗУМНИМИ ФІЛЬТРАМИ) ===
    async getRooms(req, res) {
        try {
            // 1. Збираємо параметри з URL (якщо вони є)
            const filters = {
                guests: req.query.guests,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                checkIn: req.query.checkIn,
                checkOut: req.query.checkOut,
            };

            // 2. Перевіряємо, чи є хоча б один активний фільтр
            const hasFilters = Object.values(filters).some(value => value !== undefined && value !== '');

            // 3. Якщо користувач шукає за фільтрами — оминаємо кеш (щоб не засмічувати пам'ять Redis)
            if (hasFilters) {
                console.log('🔍 Використовується пошук з фільтрами (Дані з PostgreSQL)');
                const rooms = await roomService.getAllRooms(filters);
                return res.status(200).json(rooms);
            }

            // 4. === ЛОГІКА ДЛЯ БАЗОВОГО СПИСКУ (БЕЗ ФІЛЬТРІВ) ===
            const cacheKey = 'rooms:all';
            const cachedRooms = await redisClient.get(cacheKey);

            if (cachedRooms) {
                console.log('⚡ Дані отримано з кешу Redis');
                return res.status(200).json(JSON.parse(cachedRooms));
            }

            console.log('🗄️ Дані отримано з бази даних PostgreSQL (Повний список)');
            const rooms = await roomService.getAllRooms(filters); // Тут фільтри пусті

            // Зберігаємо результат у Redis на 1 годину
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(rooms));

            res.status(200).json(rooms);
        } catch (error) {
            console.error('Помилка при отриманні кімнат:', error);
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
    },

    // Отримання однієї кімнати
    async getRoom(req, res) {
        try {
            const room = await roomService.getRoomById(req.params.id);
            if (!room) {
                return res.status(404).json({ error: 'Кімнату не знайдено' });
            }
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера' });
        }
    }
};

module.exports = roomController;