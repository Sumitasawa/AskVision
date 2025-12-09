import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";

console.log("Payment Router Loaded =", typeof paymentrouter);

const app = express();


// 📌 CONNECT TO DATABASE (WITH ERROR HANDLING)

connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1); // stop server if DB not connected
  });

// ============================================================================
// 📌 MIDDLEWARES
// ============================================================================

app.use(
  cors({
    origin: "*", // Change later for production
  })
);

app.use(express.json({ limit: "5mb" })); // important for AI messages & images

// ============================================================================
// 📌 ROUTES
// ============================================================================

app.use("/api/users", userRouter);        // /api/users/register, /login, /me
app.use("/api/chats", chatRouter);        // /api/chats, /api/chats/:id
app.use("/api/messages", messageRouter);  // /api/messages/:chatId/text, /image
app.use("/api/payments", paymentrouter);

app.get("/", (req, res) => {
  res.send("🚀 Server is live");
});

// ============================================================================
// 📌 GLOBAL ERROR HANDLER (PRODUCTION SAFETY)
// ============================================================================

app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ============================================================================
// 📌 START SERVER
// ============================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
