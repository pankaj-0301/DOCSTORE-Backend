const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// Load environment variables from .env file
// dotenv.config();

// Get MongoDB URI from environment variables
// const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
