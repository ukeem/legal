const express = require('express');
const multer = require('multer');
const path = require('path');
const { sendMessageToChat } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Настройка хранилища
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Укажите папку для сохранения файлов
    },
    filename: (req, file, cb) => {
        // Генерация имени файла с сохранением оригинального расширения
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Извлечение расширения файла
        const name = path.basename(file.originalname, ext); // Извлечение имени файла без расширения
        cb(null, `${name}-${uniqueSuffix}${ext}`); // Пример: originalname-163123123123.ext
    }
});

// Создание middleware с кастомным хранилищем
const upload = multer({ storage });

const router = express.Router();

// Маршрут для обработки текста, файлов или их комбинации
router.post('/chat', authMiddleware, upload.array('files'), sendMessageToChat);

module.exports = router;