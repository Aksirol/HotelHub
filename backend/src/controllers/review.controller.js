const reviewService = require('../services/review.service');

const reviewController = {
    // Додавання нового відгуку
    async createReview(req, res) {
        try {
            const user_id = req.user.id; // Отримуємо ID авторизованого користувача з токена
            const reviewData = req.body;

            const review = await reviewService.createReview(user_id, reviewData);
            res.status(201).json({ message: 'Відгук успішно додано', review });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Перегляд відгуків кімнати
    async getRoomReviews(req, res) {
        try {
            const { roomId } = req.params; // Отримуємо ID кімнати з URL
            const reviews = await reviewService.getRoomReviews(roomId);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ error: 'Помилка сервера при завантаженні відгуків' });
        }
    }
};

module.exports = reviewController;