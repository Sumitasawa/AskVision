import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";

const app = express();

const allowedOrigins = [
  "https://ask-vision-erzw.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);


app.use(express.json({ limit: "5mb" }));


let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB Connected");
    } catch (err) {
      console.error("❌ MongoDB Error:", err.message);
    }
  }
  next();
});


app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/payments", paymentrouter);

app.get("/", (req, res) => {
  res.send("🚀 AskVision API is live");
});


app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


export default app;
