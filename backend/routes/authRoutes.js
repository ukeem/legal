const express = require('express');
const {
    register,
    confirmRegistration,
    resetPassword,
    saveNewPassword,
    login,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register); // Регистрация
router.post('/confirm', confirmRegistration); // Подтверждение регистрации
router.post('/reset-password', resetPassword); // Сброс пароля
router.post('/save-new-password', saveNewPassword); // Сохранение нового пароля
router.post('/login', login); // Логин

module.exports = router;
