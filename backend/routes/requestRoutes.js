const express = require('express');
const { createRequest,
        addMessage,
        addAIResponse,
        addAttempts,
        getAttempts,
        getMessages,
        getAiResponses, } = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Создание нового запроса
router.post('/requests', authMiddleware, createRequest);

// Добавление сообщения пользователя
router.post('/requests/message', authMiddleware, addMessage);

// Добавление ответа AI
router.post('/requests/ai-response', authMiddleware, addAIResponse);

// Добавление попыток
router.post('/requests/add-attempts', authMiddleware, addAttempts);

// Получение количества попыток
router.get('/requests/:requestId/attempts', authMiddleware, getAttempts);

// Получение сообщений пользователя
router.get('/requests/:requestId/messages', authMiddleware, getMessages);

// Получение ответов AI
router.get('/requests/:requestId/ai-responses', authMiddleware, getAiResponses);

module.exports = router;
