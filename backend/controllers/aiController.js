const asyncHandler = require('express-async-handler');
const xlsx = require('xlsx');
const path = require('path');
const File = require('../models/File');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios'); // Import axios for reading the file from the URL

const genAI = new GoogleGenerativeAI('AIzaSyAkD2T0ieoxt3N2-CHNyyFhl72nX3BbbPg');

// Helper function to read file from a URL
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

const getAIInsights = asyncHandler(async (req, res) => {
    const { fileId } = req.body;

    if (!fileId) {
        res.status(400);
        throw new Error('Please provide a file ID');
    }

    const file = await File.findById(fileId);

    if (!file) {
        res.status(404);
        throw new Error('File not found');
    }

    // Read the uploaded Excel file from the Cloudinary URL
    const workbook = await readFileFromCloud(file.filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const dataAsString = JSON.stringify(rawData);

    const prompt = `
        You are a data analysis expert. Analyze the following data and provide a summary report with key insights, trends, and potential correlations. The data is in JSON format.
        Data:
        ${dataAsString}
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({
        message: 'AI insights generated successfully',
        insights: aiResponse,
    });
});

module.exports = { getAIInsights };