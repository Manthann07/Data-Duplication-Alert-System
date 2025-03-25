const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if MONGO_URL is defined in environment variables
  if (!process.env.MONGO_URI) {
    console.error('MongoDB connection string is not defined in environment variables');
    process.exit(1);
  }

  try {
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB Connected Successfully');
    
    // Handle MongoDB connection events
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB;

