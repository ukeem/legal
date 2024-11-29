const express = require('express');
const { getBalance, updateBalance, getVip, getRole  } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get-balance', authMiddleware, getBalance);
router.post('/update-balance', authMiddleware, updateBalance);
router.get('/get-vip', authMiddleware, getVip);
router.get('/get-role', authMiddleware, getRole);

module.exports = router;
