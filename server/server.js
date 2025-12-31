import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";

console.log("Payment Router Loaded =", typeof paymentrouter);

const app = express();



connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1); // stop server if DB not connected
  });

// 
// 📌 MIDDLEWARES
// ============================================================================

app.use(
  cors({
    origin: "*",
     credentials: true 
  })
);

app.use(express.json({ limit: "5mb" })); 

//  ROUTES


app.use("/api/users", userRouter);        // /api/users/register, /login, /me
app.use("/api/chats", chatRouter);        // /api/chats, /api/chats/:id  // /api/messages/:chatId/text, /image
app.use("/api/payments", paymentrouter);

app.get("/", (req, res) => {
  res.send("Server is live");
});



app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
