import mongoose from 'mongoose';

// Connect to MongoDB database
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fsd_project');
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    // Don't kill process immediately in dev so app can serve mock/fallback if DB is booting
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

