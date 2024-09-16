const mongoose = require('mongoose');

// MongoDB connection URI
const uri = 'mongodb+srv://pankaj:o9phHPzQ0p5D5Rq1@cluster0.yvs1pu5.mongodb.net/sharedb';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
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
