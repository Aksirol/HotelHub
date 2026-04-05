const authService = require('../services/auth.service');

const authController = {
    // Обробник для реєстрації
    async register(req, res) {
        try {
            // 🚨 БЕЗПЕКА: Витягуємо лише дозволені поля, повністю ігноруючи можливе поле 'role' від хакера
            const { email, password, first_name, last_name, phone } = req.body;
            
            // Формуємо об'єкт для бази даних, жорстко задаючи роль GUEST
            const safeUserData = {
                email,
                password,
                first_name,
                last_name,
                phone,
                role: 'GUEST' // Жоден новий користувач не може стати адміном при реєстрації
            };

            const user = await authService.registerUser(safeUserData);
            res.status(201).json({ message: 'Користувача успішно зареєстровано' });
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