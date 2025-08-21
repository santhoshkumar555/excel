// const asyncHandler = require('express-async-handler');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const path = require('path');
// const File = require('../models/File');

// // Set up multer for file storage on the local disk
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // The 'uploads/' folder must exist in your backend root
//     cb(null, path.join(__dirname, '..', 'uploads'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const uploadFile = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     res.status(400);
//     throw new Error('No file uploaded');
//   }

//   // Save file details to the database, storing the local file path
//   const file = await File.create({
//     user: req.user._id,
//     fileName: req.file.originalname,
//     filePath: req.file.filename,
//   });

//   // Read the uploaded Excel file from the local disk
//   const filePath = path.join(__dirname, '..', 'uploads', file.filePath);
//   const workbook = xlsx.readFile(filePath);
  
//   const sheetNames = workbook.SheetNames;
//   const firstSheetName = sheetNames[0];
//   const worksheet = workbook.Sheets[firstSheetName];
//   const headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];

//   res.json({
//     message: 'File uploaded and parsed successfully',
//     fileId: file._id,
//     headers,
//     sheetNames,
//   });
// });

// module.exports = { upload, uploadFile };






const asyncHandler = require('express-async-handler');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const xlsx = require('xlsx');
const axios = require('axios');
const File = require('../models/File');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name:'dsxoxpzu6',
  api_key:'631182168958356',
  api_secret:'fGSurfRrVqwYB8mqezdFHe-TyQY',
});

// Configure Multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'excel-analytics-files',
    resource_type: 'raw',
  },
});

const upload = multer({ storage });

// This function will now be a separate helper to read files
const readFileFromCloud = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const data = new Uint8Array(response.data);
        return xlsx.read(data, { type: 'array' });
    } catch (error) {
        console.error('Error reading file from Cloudinary:', error);
        throw new Error('Error processing file from cloud storage.');
    }
};

// @desc    Upload an Excel file to Cloudinary and parse its headers
// @route   POST /api/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const file = await File.create({
    user: req.user._id,
    fileName: req.file.originalname,
    filePath: req.file.path,
  });

  const workbook = await readFileFromCloud(file.filePath);
  const sheetNames = workbook.SheetNames;
  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const headers = data[0].filter(header => header !== null && header !== undefined);

  res.json({
    message: 'File uploaded and parsed successfully',
    fileId: file._id,
    headers,
    sheetNames,
  });
});

module.exports = { upload, uploadFile };