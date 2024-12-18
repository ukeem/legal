const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true, // Связь с пользователем
	},
	attemptsLeft: {
		type: Number,
		default: 3, // Начальное количество попыток
		required: true,
	},
	messages: [
		{
			role: {
				type: String,
				enum: ['user', 'assistant'], // Кто отправил сообщение: пользователь или AI
				required: true,
			},
			content: {
				type: String,
				required: true, // Текст сообщения
			},
			timestamp: {
				type: Date,
				default: Date.now, // Дата и время отправки
			},
		},
	],
	threadId: {
		type: String,
		required: true, // Дата создания запроса
	},
	createdAt: {
		type: Date,
		default: Date.now, // Дата создания запроса
	},
});

module.exports = mongoose.model('Request', requestSchema);
