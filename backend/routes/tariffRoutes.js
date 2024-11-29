const express = require('express');
const { getTariffs, addTariff, buyTariff, deleteTariff  } = require('../controllers/tarrifController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get-tariffs', authMiddleware, getTariffs);
router.post('/add-tariff', authMiddleware, addTariff);
router.post('/buy-tariff', authMiddleware, buyTariff);
router.delete('/delete/:id', authMiddleware, deleteTariff);

module.exports = router;
