import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI?.trim();

  if (!uri) {
    throw new Error("MONGO_URI is required to start the server");
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;