import express from "express";
import { createChat, deleteChat, getChat } from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

const chatrouter = express.Router();
console.log("chatRoutes.js loaded");

// Create a chat
chatrouter.post("/", protect, createChat);

// Get all chats for logged-in user
chatrouter.get("/", protect, getChat);

// Delete a chat
chatrouter.delete("/:chatId", protect, deleteChat);

export default chatrouter;
