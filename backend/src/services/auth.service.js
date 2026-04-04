const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Секретний ключ для підпису токенів (з файлу .env)
const JWT_SECRET = process.env.JWT_SECRET;

const authService = {
    // === Реєстрація нового користувача ===
    async registerUser(userData) {
        const { email, password, first_name, last_name, phone } = userData;

        // 1. Перевіряємо, чи користувач з таким email вже існує
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Користувач з таким email вже існує');
        }

        // 2. Хешуємо пароль (salt rounds = 12, як вказано в дипломі)
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 3. Зберігаємо користувача в базу даних
        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash,
                first_name,
                last_name,
                phone
            }
        });

        return newUser;
    },

    // === Вхід користувача (Логін) ===
    async loginUser(email, password) {
        // 1. Шукаємо користувача за email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Невірний email або пароль');
        }

        // 2. Порівнюємо введений пароль із хешем у базі
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Невірний email або пароль');
        }

        // 3. Генеруємо JWT токен (дійсний 15 хвилин)
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '15m' }
        );

        return { user, token };
    }
};

module.exports = authService;