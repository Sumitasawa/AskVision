import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check for token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET is missing in .env file");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    // 3️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // 4️⃣ Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 5️⃣ Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("Protect Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization middleware failed",
    });
  }
};
