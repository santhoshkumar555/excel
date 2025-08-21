const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const File = require('../models/File'); // Import the File model
const asyncHandler = require('express-async-handler');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.route('/users').get(protect, admin, asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
}));

// @desc    Get aggregated data for admin charts
// @route   GET /api/admin/stats
// @access  Private/Admin
router.route('/stats').get(protect, admin, asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments({});
  const fileCount = await File.countDocuments({});
  
  res.json({
    userCount,
    fileCount,
  });
}));

// @desc    Update a user's admin status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.route('/users/:id').put(protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.route('/users/:id').delete(protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Get all uploaded files
// @route   GET /api/admin/files
// @access  Private/Admin
router.route('/files').get(protect, admin, asyncHandler(async (req, res) => {
  const files = await File.find({}).populate('user', 'name email'); // Populate the user details
  res.json(files);
}));

router.route('/files-by-user').get(protect, admin, asyncHandler(async (req, res) => {
    const filesByUser = await File.aggregate([
        {
            $group: {
                _id: '$user',
                fileCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                _id: 0,
                userName: '$user.name',
                userEmail: '$user.email',
                fileCount: 1
            }
        }
    ]);
    res.json(filesByUser);
}));

module.exports = router;