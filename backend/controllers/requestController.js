const Request = require('../models/Request');
const User = require('../models/User');


exports.createRequest = async (req, res) => {
    try {
        const userId = req.user.id; // Получаем ID пользователя из токена

        const newRequest = new Request({
            userId,
            attemptsLeft: 3, // Начальное количество попыток
            messages: [],
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error('Ошибка при создании запроса:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { requestId, message } = req.body; // ID запроса и сообщение пользователя

        if (!requestId || !message || message.trim() === '') {
            return res.status(400).json({ errMessage: 'Введите сообщение' });
        }

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ errMessage: 'Запрос не найден' });
        }

        if (request.attemptsLeft <= 0) {
            return res.status(400).json({ errMessage: 'Закончились попытки' });
        }

        // Добавляем сообщение пользователя
        request.messages.push({
            role: 'user',
            content: message,
        });

        // Уменьшаем количество попыток
        // request.attemptsLeft -= 1;

        const updatedRequest = await request.save();
        res.status(200).json(updatedRequest);
    } catch (err) {
        console.error('Ошибка при добавлении сообщения:', err);
        res.status(500).json({ errMessage: 'Ошибка сервера' });
    }
};

exports.addAIResponse = async (req, res) => {
    try {
        const { requestId, response } = req.body; // ID запроса и ответ AI

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ errMessage: 'Запрос не найден' });
        }

        // Добавляем сообщение AI
        request.messages.push({
            role: 'assistant',
            content: response,
        });

        const updatedRequest = await request.save();
        res.status(200).json(updatedRequest);
    } catch (err) {
        console.error('Ошибка при добавлении ответа AI:', err);
        res.status(500).json({ errMessage: 'Ошибка сервера' });
    }
};

exports.addAttempts = async (req, res) => {
    try {
        const { requestId, attempts } = req.body;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Запрос не найден' });
        }

        request.attemptsLeft += attempts;

        const updatedRequest = await request.save();
        res.status(200).json(updatedRequest);
    } catch (err) {
        console.error('Ошибка при добавлении попыток:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


exports.getAttempts = async (req, res) => {
    try {
        const { requestId } = req.params; // ID запроса из параметров URL
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Запрос не найден' });
        }

        res.status(200).json({ attemptsLeft: request.attemptsLeft });
    } catch (err) {
        console.error('Ошибка при получении попыток:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { requestId } = req.params; // ID запроса из параметров URL
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Запрос не найден' });
        }

        const userMessages = request.messages.filter(msg => msg.role === 'user');
        res.status(200).json({ messages: userMessages });
    } catch (err) {
        console.error('Ошибка при получении сообщений пользователя:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


exports.getAiResponses = async (req, res) => {
    try {
        const { requestId } = req.params; // ID запроса из параметров URL
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Запрос не найден' });
        }

        const aiResponses = request.messages.filter(msg => msg.role === 'assistant');
        res.status(200).json({ responses: aiResponses });
    } catch (err) {
        console.error('Ошибка при получении ответов AI:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
