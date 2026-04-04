const express = require('express');
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// === Публічні маршрути ===
// Перегляд відгуків для конкретної кімнати доступний усім
router.get('/room/:roomId', reviewController.getRoomReviews);

// === Захищені маршрути ===
// Додавати відгук можуть лише авторизовані користувачі
router.post('/', verifyToken, reviewController.createReview);

module.exports = router;