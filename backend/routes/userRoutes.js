const express = require('express');
const { registerUser, authUser, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // <-- Add this import

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;