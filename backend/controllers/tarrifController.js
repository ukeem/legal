const Tariff = require('../models/Tariff');
const User = require('../models/User');

exports.getTariffs = async (req, res) => {
    try {
        // Получаем тарифы из базы данных
        const tariffs = await Tariff.find();

        // Если тарифы отсутствуют, возвращаем сообщение с кодом 404
        if (!tariffs || tariffs.length === 0) {
            return res.status(404).json({ message: 'Тарифных планов нет' });
        }

        // Возвращаем список тарифов с кодом 200
        res.status(200).json(tariffs);
    } catch (err) {
        console.error('Ошибка получения тарифов:', err.message);
        // Возвращаем сообщение об ошибке сервера
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};



exports.addTariff = async (req, res) => {
    const { cost, type, requestCount, dayCount } = req.body;

    try {
        console.log( cost)
        if (!cost || typeof cost !== 'number' || cost <= 0) {
            console.log('Полученное значение cost:', cost, typeof cost);
            return res.status(400).json({ message: 'Введите стоимость цифрами' });
        }

        if (!type || !['fixed', 'subscription'].includes(type)) {
            return res.status(400).json({ message: 'Выберите тип тарифа' });
        }
        if (type === 'fixed' && (!requestCount || requestCount <= 0)) {
            return res.status(400).json({ message: 'Введите кол-во запросов цифрами' });
        }
        if (type === 'subscription' && (!dayCount || dayCount <= 0)) {
            return res.status(400).json({ message: 'Введите период подписки цифрами' });
        }
        

        // Формирование параметров
        const params = type === 'subscription'
            ? { cost, type, requestCount: null, dayCount }
            : { cost, type, requestCount, dayCount: null };

        // Сохранение тарифа
        const newTariff = new Tariff(params);
        await newTariff.save();

        res.status(201).json({ message: 'Тариф успешно добавлен', tariff: newTariff });
    } catch (err) {
        console.error('Ошибка добавления тарифа:', err.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


exports.buyTariff = async (req, res) => {
    const userId = req.user.id; // ID пользователя из токена
    const { tariffId } = req.body; // ID тарифа

    try {
        // Проверяем существование пользователя
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем существование тарифа
        const tariff = await Tariff.findById(tariffId);
        if (!tariff) {
            return res.status(404).json({ message: 'Тариф не найден' });
        }

        // Логика для подписки
        if (tariff.type === 'subscription') {
            if (user.subscription.isActive) {
                return res.status(400).json({ message: 'У вас уже есть активная подписка' });
            }

            // Активируем подписку
            user.subscription.isActive = true;
            user.subscription.startDate = new Date();
            user.subscription.durationDays = tariff.dayCount; // Устанавливаем длительность подписки
        } else if (tariff.type === 'fixed') {
            // Увеличиваем баланс запросов
            user.balance += tariff.requestCount;
        }

        // Сохраняем изменения пользователя
        await user.save();

        // Возвращаем обновленного пользователя
        res.status(200).json({
            message: 'Тариф успешно приобретен',
            user: {
                id: user._id,
                email: user.email,
                balance: user.balance,
                subscription: user.subscription,
            },
        });
    } catch (err) {
        console.error('Ошибка покупки тарифа:', err.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.deleteTariff = async (req, res) => {
    const { id } = req.params;
    console.log('Полученный ID для удаления:', id);

    try {
        const tariff = await Tariff.findById(id);
        if (!tariff) {
            return res.status(404).json({ message: 'Тариф не найден' });
        }

        await Tariff.findByIdAndDelete(id);
        res.status(200).json({ message: 'Тариф успешно удален' });
    } catch (err) {
        console.error('Ошибка удаления тарифа:', err.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
