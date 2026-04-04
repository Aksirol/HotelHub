const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// === 1. Перевірка наявності та дійсності токена ===
const verifyToken = (req, res, next) => {
    // Шукаємо заголовок Authorization у запиті
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Доступ заборонено. Токен відсутній.' });
    }

    // Витягуємо сам токен (відкидаємо слово "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // Перевіряємо токен за допомогою нашого секретного ключа
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Зберігаємо розшифровані дані (id та role) в об'єкт запиту, 
        // щоб наступні функції могли знати, хто робить запит
        req.user = decoded;
        
        // Передаємо управління далі (до наступної функції або контролера)
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Недійсний або прострочений токен.' });
    }
};

// === 2. Перевірка ролі користувача (RBAC) ===
// Ця функція приймає масив дозволених ролей і повертає middleware
const requireRoles = (roles) => {
    return (req, res, next) => {
        // req.user вже повинен бути встановлений попереднім middleware (verifyToken)
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'У вас немає прав для виконання цієї дії.' 
            });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    requireRoles
};