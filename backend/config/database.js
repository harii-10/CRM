const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use hardcoded URI as a fallback if environment variable is not available
    const uri = process.env.MDB_URI || 'mongodb://localhost:27017/CRM';
    console.log('Connecting to MongoDB with URI:', uri);
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

module.exports = { connectDB };