const express = require('express');
const roomController = require('../controllers/room.controller');
const { verifyToken, requireRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// === Публічні маршрути (для гостей) ===
router.get('/', roomController.getRooms);
router.get('/types', roomController.getTypes);

// === Захищені маршрути (тільки для ADMIN) ===
router.post(
    '/types', 
    verifyToken, 
    requireRoles(['ADMIN']), 
    roomController.createType
);

router.post(
    '/', 
    verifyToken, 
    requireRoles(['ADMIN']), 
    roomController.createRoom
);

module.exports = router;