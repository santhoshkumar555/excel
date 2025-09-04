// const asyncHandler = require('express-async-handler');
// const xlsx = require('xlsx');
// const path = require('path');
// const File = require('../models/File');
// const History = require('../models/History');

// const getChartData = asyncHandler(async (req, res) => {
//   const { fileId, xAxis, yAxis, zAxis, chartType, sheetName } = req.body;

//   if (!fileId || !xAxis || !yAxis || !chartType || !sheetName) {
//     res.status(400);
//     throw new Error('Please provide all required parameters');
//   }

//   const file = await File.findById(fileId);

//   if (!file) {
//     res.status(404);
//     throw new Error('File not found');
//   }

//   const filePath = path.join(__dirname, '..', 'uploads', file.filePath);
//   const workbook = xlsx.readFile(filePath);
//   const worksheet = workbook.Sheets[sheetName];
//   const rawData = xlsx.utils.sheet_to_json(worksheet);

//   const labels = rawData.map(row => row[xAxis]);
//   const data = rawData.map(row => row[yAxis]);

//   // For 3D charts, also extract the Z-axis data
//   let zData = [];
//   if (zAxis) {
//     zData = rawData.map(row => row[zAxis]);
//   }

//   await History.create({
//     user: req.user._id,
//     file: fileId,
//     xAxis,
//     yAxis,
//     zAxis, // Save zAxis to history
//     chartType,
//   });

//   res.json({
//     labels,
//     data,
//     zData, // Return the new Z-axis data
//   });
// });

// module.exports = { getChartData };

const asyncHandler = require('express-async-handler');
const xlsx = require('xlsx');
const path = require('path');
const File = require('../models/File');
const History = require('../models/History');
const axios = require('axios');

// Helper function to read file from a URL
const readFileFromCloud = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const data = new Uint8Array(response.data);
    return xlsx.read(data, { type: 'array' });
};

const getChartData = asyncHandler(async (req, res) => {
  const { fileId, xAxis, yAxis, zAxis, chartType, sheetName } = req.body; 
  // <-- include zAxis

  if (!fileId || !xAxis || !yAxis || !chartType || !sheetName) {
    res.status(400);
    throw new Error('Please provide all required parameters');
  }

  const file = await File.findById(fileId);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  const workbook = await readFileFromCloud(file.filePath);
  const worksheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json(worksheet);

  const labels = rawData.map(row => row[xAxis]);
  const data = rawData.map(row => row[yAxis]);
  let zData = null;

  // ✅ Only collect Z if provided
  if (zAxis) {
    zData = rawData.map(row => row[zAxis]);
  }

  await History.create({
    user: req.user._id,
    file: fileId,
    xAxis,
    yAxis,
    zAxis,         // <-- save in history too
    chartType,
  });

  res.json({
    labels,
    data,
    zData,        // <-- include in response
  });
});


module.exports = { getChartData };