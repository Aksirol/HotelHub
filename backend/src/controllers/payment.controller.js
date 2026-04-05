// backend/src/controllers/payment.controller.js
const paymentService = require('../services/payment.service');

const paymentController = {
    async processPayment(req, res) {
        try {
            const user_id = req.user.id; // Беремо ID з токена
            const paymentData = req.body; // Очікуємо booking_id та method

            const result = await paymentService.processPayment(user_id, paymentData);

            const io = req.app.get('io');
            if (io) {
                io.to('admin_room').emit('admin_dashboard_update');
            }

            res.status(200).json({
                message: 'Оплату успішно проведено',
                data: result
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = paymentController;