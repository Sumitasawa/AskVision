import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";

const app = express();


connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  });

const allowedOrigins = [
  "https://ask-vision-erzw.vercel.app", 
];

app.use(
  cors({
    origin: function (origin, callback) {
    
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ CORS not allowed from this origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());

=
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/payments", paymentrouter);


app.get("/", (req, res) => {
  res.status(200).send("AskVision API is live");
});


app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
