import express from "express";
import { registerUser, loginUser, getUser, getPublishedImages } from "../controllers/UserController.js";
import { protect } from "../middlewares/auth.Middleware.js";

const userRouter = express.Router();

// Register new user
userRouter.post("/register", registerUser);

// Login user
userRouter.post("/login", loginUser);

// Get currently authenticated user
userRouter.get("/me", protect, getUser);

//Get published-images
userRouter.get("/published-images",getPublishedImages)
export default userRouter;
