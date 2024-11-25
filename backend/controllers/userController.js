const User = require('../models/User');

exports.getBalance = async (req, res) => {
    try {
        const userId = req.user.id; // Предполагается, что ID пользователя есть в токене

        const user = await User.findById(userId, 'balance'); // Получаем только баланс
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ balance: user.balance });
    } catch (err) {
        console.error('Ошибка получения баланса:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.updateBalance = async (req, res) => {
    const { amount } = req.body; // `amount` может быть отрицательным для списания или положительным для пополнения

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: 'Некорректное значение суммы' });
    }

    try {
        const userId = req.user.id; // ID пользователя из токена
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (user.balance + amount < 0) {
            return res.status(400).json({ message: 'Недостаточно средств' });
        }

        user.balance += amount; // Обновляем баланс
        await user.save();

        res.status(200).json({ balance: user.balance });
    } catch (err) {
        console.error('Ошибка обновления баланса:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};