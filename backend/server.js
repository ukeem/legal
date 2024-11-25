require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes')
const chatRoutes = require('./routes/chatRoutes')

// Подключение к базе данных
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', requestRoutes);
app.use('/api', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
