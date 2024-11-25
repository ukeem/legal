const express = require('express');
const { getBalance, updateBalance  } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get-balance', authMiddleware, getBalance);
router.post('/update-balance', authMiddleware, updateBalance);

module.exports = router;
