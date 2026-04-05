const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Реєстрація нового користувача
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * first_name:
 * type: string
 * last_name:
 * type: string
 * phone:
 * type: string
 * responses:
 * 201:
 * description: Користувача успішно зареєстровано
 * 400:
 * description: Помилка реєстрації
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Вхід у систему
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Успішний вхід
 * 401:
 * description: Невірний email або пароль
 */
router.post('/login', authController.login);

module.exports = router;