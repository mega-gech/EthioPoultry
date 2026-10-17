import mongoose from "mongoose";

const connectDB = async (): Promise<void>=>{
    const uri = process.env.MONGO_URI
    if (!uri){
        throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(uri);

     console.log("MongoDB Atlas connected successfully");
}

export default connectDB