require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const chatRoutes = require('./routes/chatRoutes');
const tariffRoutes = require('./routes/tariffRoutes');
const cron = require('node-cron');
const User = require('./models/User'); // Путь к модели пользователя



// Подключение к базе данных
connectDB();

// Задание для проверки истекших подписок
cron.schedule('0 0 * * *', async () => {
	console.log('Запуск проверки истекших подписок...');

	try {
		// Текущая дата
		const currentDate = new Date();

		// Найти пользователей с активной подпиской
		const usersWithActiveSubscriptions = await User.find({ 'subscription.isActive': true });

		for (const user of usersWithActiveSubscriptions) {
			const expirationDate = new Date(user.subscription.startDate);
			expirationDate.setDate(expirationDate.getDate() + user.subscription.durationDays);

			// Проверка, истекла ли подписка
			if (currentDate >= expirationDate) {
				// Снятие подписки
				user.subscription.isActive = false;
				user.subscription.startDate = null;
				user.subscription.durationDays = null;
				user.balance = 0;

				await user.save();
				console.log(`Подписка деактивирована для пользователя: ${user.email}`);
			}
		}

		console.log('Проверка истекших подписок завершена.');
	} catch (err) {
		console.error('Ошибка при проверке подписок:', err);
	}
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', requestRoutes);
app.use('/api', chatRoutes);
app.use('/api', tariffRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
