const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Неавторизован' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Сохраняем данные пользователя в запрос
        console.log('Authenticated user:', req.user);
        next();
    } catch (err) {
        console.error('Ошибка токена:', err);
        res.status(401).json({ message: 'tokenFail' });
    }
};

module.exports = authMiddleware;
