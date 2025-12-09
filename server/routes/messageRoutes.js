import express from "express";
import { protect } from "../middlewares/auth.js";
import { messageController, imageMessageController } from "../controllers/messageController.js";
console.log("messageRoutes.js loaded");

const messageRouter = express.Router();

// TEXT MESSAGE → POST /messages/:chatId/text
messageRouter.post("/:chatId/text", protect, messageController);

// IMAGE MESSAGE → POST /messages/:chatId/image
messageRouter.post("/:chatId/image", protect, imageMessageController);

export default messageRouter;
