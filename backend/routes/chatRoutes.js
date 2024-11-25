const express = require('express');
const multer = require('multer');
const { sendMessageToChat } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Настройка загрузки файлов с помощью multer
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Маршрут для обработки текста, файлов или их комбинации
router.post('/chat', authMiddleware, upload.array('files', 10), sendMessageToChat);

module.exports = router;