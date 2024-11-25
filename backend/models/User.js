const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    balance: { type: Number, default: 0 },
    plan: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);