const mongoose = require('mongoose');

const historySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'File',
    },
    xAxis: {
      type: String,
      required: true,
    },
    yAxis: {
      type: String,
      required: true,
    },
    zAxis: { // New optional field for 3D charts
      type: String,
    },
    chartType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model('History', historySchema);

module.exports = History;