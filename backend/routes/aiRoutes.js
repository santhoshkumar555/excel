const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getAIInsights } = require('../controllers/aiController');

const router = express.Router();

router.route('/insights').post(protect, getAIInsights);

module.exports = router;