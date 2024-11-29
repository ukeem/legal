const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    subscription: {
        isActive: { type: Boolean, default: false }, // Активна ли подписка
        startDate: { type: Date }, // Дата начала подписки
        durationDays: { type: Number }, // Длительность подписки (в днях)
    },
    balance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

