import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(" MongoDB Disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "AskVision",
    });
  } catch (error) {
    console.error("Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
