const roomService = require('../services/room.service');

const roomController = {
    // Додавання типу кімнати
    async createType(req, res) {
        try {
            const roomType = await roomService.createRoomType(req.body);
            res.status(201).json({ message: 'Тип кімнати створено', roomType });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Отримання типів кімнат
    async getTypes(req, res) {
        try {
            const types = await roomService.getAllRoomTypes();
            res.status(200).json(types);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера' });
        }
    },

    // Додавання кімнати
    async createRoom(req, res) {
        try {
            const room = await roomService.createRoom(req.body);
            res.status(201).json({ message: 'Кімнату успішно додано', room });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Отримання всіх кімнат
    async getRooms(req, res) {
        try {
            const rooms = await roomService.getAllRooms();
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера' });
        }
    }
};

module.exports = roomController;