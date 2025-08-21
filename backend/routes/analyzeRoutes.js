const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getChartData } = require('../controllers/analyzeController');

const router = express.Router();

router.route('/').post(protect, getChartData);

module.exports = router;