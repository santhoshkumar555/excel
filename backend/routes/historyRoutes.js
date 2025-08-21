const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUserHistory } = require('../controllers/historyController');

const router = express.Router();

router.route('/').get(protect, getUserHistory);

module.exports = router;