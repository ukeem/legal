const Request = require('../models/Request');
const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
	apiKey: process.env.API_KEY || "ВАШ_API_KEY",
});

exports.createRequest = async (req, res) => {
	try {
		const userId = req.user.id; // Получаем ID пользователя из токена

		const thread = await openai.beta.threads.create();
		const newRequest = new Request({
			userId,
			attemptsLeft: 3, // Начальное количество попыток
			messages: [],
			threadId: thread.id
		});

		const savedRequest = await newRequest.save();
		console.log(thread.id)
		res.status(201).json(savedRequest);
	} catch (err) {
		console.error('Ошибка при создании запроса:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};

exports.getAllRequests = async (req, res) => {
	try {
		// Получаем запросы из базы данных
		const requests = await Request.find();

		// Если запросы отсутствуют, возвращаем сообщение с кодом 404
		if (!requests || requests.length === 0) {
			return res.status(404).json({ message: 'Запросов нет' });
		}

		// Возвращаем список запросов с кодом 200
		res.status(200).json(requests);
	} catch (err) {
		console.error('Ошибка получения Запросов:', err.message);
		// Возвращаем сообщение об ошибке сервера
		res.status(500).json({ message: 'Ошибка сервера' });
	}
}

exports.getRequests = async (req, res) => {
	const userId = req.user.id; // ID пользователя из токена

	try {
		// Получаем запросы из базы данных, связанные с пользователем
		const requests = await Request.find({ userId });

		// Если запросы отсутствуют, возвращаем сообщение с кодом 404
		if (!requests || requests.length === 0) {
			return res.status(404).json({ message: 'Запросов нет' });
		}

		// Возвращаем список запросов с кодом 200
		res.status(200).json(requests);
	} catch (err) {
		console.error('Ошибка получения запросов:', err.message);
		// Возвращаем сообщение об ошибке сервера
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};



exports.deleteRequestAll = async (req, res) => {
	const userId = req.user.id; // ID пользователя из токена

	try {
		// Удаляем запросы из базы данных, связанные с пользователем
		const result = await Request.deleteMany({ userId });

		// Проверяем, были ли удалены запросы
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: 'Запросов для удаления не найдено.' });
		}

		// Возвращаем сообщение об успешной очистке
		res.status(200).json({ message: 'История запросов успешно очищена.' });
	} catch (err) {
		console.error('Ошибка при удалении запросов:', err.message);
		// Возвращаем сообщение об ошибке сервера
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};




exports.deleteRequest = async (req, res) => {
	const { id } = req.params;
	// console.log('Полученный ID для удаления:', id);

	try {
		const request = await Request.findById(id);
		if (!request) {
			return res.status(404).json({ message: 'Запрос не найден' });
		}

		await Request.findByIdAndDelete(id);
		res.status(200).json({ message: 'Запрос успешно удален' });
	} catch (err) {
		console.error('Ошибка удаления тарифа:', err.message);
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

		console.log('Полученные данные:', req.body);

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

exports.getThreadId = async (req, res) => {
	try {
		const { requestId } = req.params; // ID запроса из параметров URL
		const request = await Request.findById(requestId);

		if (!request) {
			return res.status(404).json({ message: 'Запрос не найден' });
		}

		res.status(200).json({ threadId: request.threadId });
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
