import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("bufferCommands", false); // 🔥 IMPORTANT

    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // 🔥 stop server if DB fails
  }
};

export default connectDB;