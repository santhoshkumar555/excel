const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { deleteFile } = require('../controllers/fileController');

const router = express.Router();

router.route('/:id').delete(protect, deleteFile);

module.exports = router;