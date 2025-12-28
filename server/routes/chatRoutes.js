import express from "express";
import { protect } from "../middlewares/auth.Middleware.js";

import {
  createChat,
  deleteChat,
  getChat,
} from "../controllers/chatController.js";

import {
  messageController,
  imageMessageController,
} from "../controllers/messageController.js";

const chatrouter = express.Router();
chatrouter.post("/", protect, createChat);
chatrouter.get("/", protect, getChat);
chatrouter.delete("/:chatId", protect, deleteChat);

chatrouter.post("/:chatId/message", protect, messageController);
chatrouter.post("/:chatId/image", protect, imageMessageController);

export default chatrouter;
