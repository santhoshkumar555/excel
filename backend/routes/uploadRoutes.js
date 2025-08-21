const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { upload, uploadFile } = require('../controllers/uploadController');

const router = express.Router();

// The 'upload.single('excelFile')' is multer middleware that handles the file named 'excelFile'
router.route('/').post(protect, upload.single('excelFile'), uploadFile);

module.exports = router;