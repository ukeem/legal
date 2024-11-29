const mongoose = require('mongoose');

const tariffSchema = new mongoose.Schema({
    cost: { type: Number, required: true },
    type: { type: String, enum: ['fixed', 'subscription'], required: true },
    requestCount: { type: Number, default: 0 },
    dayCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Tariff', tariffSchema);
