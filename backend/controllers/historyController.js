const asyncHandler = require('express-async-handler');
const History = require('../models/History');
const File = require('../models/File');

// @desc    Get all files and analysis history for the logged-in user
// @route   GET /api/history
// @access  Private
const getUserHistory = asyncHandler(async (req, res) => {
  const history = await History.find({ user: req.user._id }).populate('file');
  const files = await File.find({ user: req.user._id });
  
  res.json({
    history,
    files,
  });
});

module.exports = { getUserHistory };