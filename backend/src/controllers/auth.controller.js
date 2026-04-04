const authService = require('../services/auth.service');

const authController = {
    // Обробник для реєстрації
    async register(req, res) {
        try {
            // Отримуємо дані з тіла запиту
            const userData = req.body; 
            const newUser = await authService.registerUser(userData);
            
            // Не відправляємо хеш пароля клієнту з міркувань безпеки
            delete newUser.password_hash;

            res.status(201).json({
                message: 'Користувача успішно зареєстровано',
                user: newUser
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Обробник для логіну
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.loginUser(email, password);

            delete user.password_hash;

            res.status(200).json({
                message: 'Успішний вхід',
                token,
                user
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
};

module.exports = authController;