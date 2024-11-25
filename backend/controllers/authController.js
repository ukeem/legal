const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
require('dotenv').config();

const FRONTEND_URL = process.env.FRONTEND_URL;

exports.register = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Логирование для отладки
    console.log("Request body:", req.body);

    if (!email || !password || !confirmPassword) {
        console.error("Все поля обязательны");
        return res.status(400).json({ message: "Все поля обязательны" });
    }

    if (password !== confirmPassword) {
        console.error("Пароли не совпадают");
        return res.status(400).json({ message: "Пароли не совпадают" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Email уже зарегистрирован");
            return res.status(400).json({ message: "Email уже зарегистрирован" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email, hashedPassword }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const confirmationLink = `${process.env.FRONTEND_URL}/confirmed?token=${token}`;

        await sendEmail(
            email,
            "Подтверждение регистрации",
            `<div 
            style='
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            '>
            <a style='
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 280px;
                height: 48px;
                border: 1px solid #424242;
                background-color: #424242;
                color: #fff;
                font-size: 16px;
                line-height: 48px;
                cursor: pointer;
                text-decoration: none;
            ' href="${confirmationLink}">Подтвердите ваш Email</a></div>`
        );

        res.status(200).json({ message: "Подтвердите ваш Email" });
    } catch (err) {
        console.error("Ошибка сервера:", err); // Логирование ошибок
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

exports.confirmRegistration = async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, hashedPassword } = decoded;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(201).json({ message: "Email уже зарегистрирован" });
        }

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(200).json({ message: "Регистрация успешно завершена" });
    } catch (err) {
        console.error("Ошибка сервера:", err); // Логирование ошибок
        res.status(500).json({ message: "Ошибка сервера" });
    }
};



// Сброс пароля
// exports.resetPassword = async (req, res) => {
//     const { email } = req.body;

//     try {
//         // Проверка существования email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'Email не найден' });
//         }

//         // Генерация ссылки сброса пароля
//         const resetLink = `${FRONTEND_URL}/new-password?e=${encodeURIComponent(email)}`;
//         await sendEmail(email, 'Reset Password', `Click <a href="${resetLink}">here</a> to reset your password.`);

//         res.status(200).json({ message: 'Reset password email sent' });
//     } catch (err) {
//         console.error("Ошибка сервера:", err); // Логирование ошибок
//         res.status(500).json({ message: "Ошибка сервера" });
//     }
// };

exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email не найден" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const resetLink = `${FRONTEND_URL}/new-password?token=${token}`;
        await sendEmail(
            email,
            "Сброс пароля",
            `<div 
            style='
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            '>
            <a style='
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 280px;
                height: 48px;
                border: 1px solid #424242;
                background-color: #424242;
                color: #fff;
                font-size: 16px;
                line-height: 48px;
                cursor: pointer;
                text-decoration: none;
            ' href="${resetLink}">Сбросить пароль</a></div>`
        );

        res.status(200).json({ message: "Ссылка отправлена на Email" });
    } catch (err) {
        console.error("Ошибка сервера:", err); // Логирование ошибок
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Сохранение нового пароля
exports.saveNewPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        console.error("Пароли не совпадают");
        return res.status(400).json({ message: "Пароли не совпадают" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        res.status(200).json({ message: "Пароль успешно изменен" });
    } catch (err) {
        console.error("Ошибка сервера:", err); // Логирование ошибок
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Авторизация
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверка существования пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email не зарегистрирован" });
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        // Генерация JWT токена
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Ошибка сервера:", err); // Логирование ошибок
        res.status(500).json({ message: "Ошибка сервера" });
    }
};
