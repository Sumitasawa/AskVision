import Chat from "../models/Chat.js";
import mongoose from "mongoose";

// CREATE CHAT
export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      userId: req.user._id,
      username: req.user.name,
      chatname: "New Chat",
      messages: [],
    });

    res.status(201).json({
      success: true,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Create Chat Error:", error);
    res.status(500).json({ success: false, message: "Failed to create chat" });
  }
};

// GET CHATS
export const getChat = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select("_id chatname updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, chats });
  } catch (error) {
    console.error("Get Chats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch chats" });
  }
};

// DELETE CHAT
export const deleteChat = async (req, res) => {
  try {
     const userId = req.user._id;
    const { chatId } = req.params;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ success: false, message: "Invalid chatId" });
    }

    const deleted = await Chat.deleteOne({
      _id: chatId,
      userId: req.user._id,
    });

    if (!deleted.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or unauthorized",
      });
    }

    res.json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete chat" });
  }
};
