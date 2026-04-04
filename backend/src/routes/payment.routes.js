// backend/src/routes/payment.routes.js
const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Оплата доступна лише авторизованим користувачам
router.post('/process', verifyToken, paymentController.processPayment);

module.exports = router;