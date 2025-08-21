const asyncHandler = require('express-async-handler');
const File = require('../models/File');
const History = require('../models/History');
const fs = require('fs');
const path = require('path');

// @desc    Delete an uploaded file and its history
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Allow admins to delete any file, otherwise check for file ownership
  if (req.user.isAdmin || file.user.toString() === req.user._id.toString()) {
    // Delete the file from the local uploads folder
    const filePath = path.join(__dirname, '..', 'uploads', file.filePath);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Error deleting file from local storage:', err);
      }
      
      await History.deleteMany({ file: file._id });
      await file.deleteOne();
      
      res.json({ message: 'File and associated history deleted successfully' });
    });
  } else {
    res.status(401);
    throw new Error('User not authorized to delete this file');
  }
});

module.exports = { deleteFile };