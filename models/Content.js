const mongoose = require('mongoose');

// Define schema
const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,},
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export model
module.exports = mongoose.model('Content', contentSchema);
