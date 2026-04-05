const express = require('express');
const upload = require('../config/upload.config');
const roomController = require('../controllers/room.controller');
const { verifyToken, requireRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// === Публічні маршрути (для гостей) ===
router.get('/', roomController.getRooms);
router.get('/types', roomController.getTypes);
// Отримати одну кімнату за ID
router.get('/:id', roomController.getRoom);

// === Захищені маршрути (тільки для ADMIN) ===
router.post(
    '/types', 
    verifyToken, 
    requireRoles(['ADMIN']), 
    roomController.createType
);

router.post(
    '/:id/image', 
    verifyToken, 
    requireRoles(['ADMIN']), 
    upload.single('room_image'), 
    roomController.uploadImage
);

router.post(
    '/', 
    verifyToken, 
    requireRoles(['ADMIN']), 
    roomController.createRoom
);

module.exports = router;