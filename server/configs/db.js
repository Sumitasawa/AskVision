import mongoose from "mongoose";
let isConnected = false;
const connectDB = async () => {
  try {
    if (isConnected) return;

    mongoose.connection.once("connected", () => {
      console.log("MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB Disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "AskVision",
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;

  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
