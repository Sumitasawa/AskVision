import Chat from "../models/Chat.js";
import mongoose from "mongoose";

// ============================================================================
// 📌 CREATE NEW CHAT — FIXED
// ============================================================================

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      chatname: "New Chat",
      username: req.user.name
    };

    const newChat = await Chat.create(chatData);

    // Return the new chat ID so frontend navigates to it
    res.json({
      success: true,
      message: "Chat created",
      chatId: newChat._id
    });

  } catch (error) {
    console.error("Create Chat Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================================================================
// 📌 GET ALL CHATS — FIXED
// ============================================================================

export const getChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      message: "Chats fetched",
      chats
    });

  } catch (error) {
    console.error("Get Chats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================================================================
// 📌 DELETE CHAT — FIXED + VALIDATION + SAFETY CHECKS
// ============================================================================

export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    // 1️⃣ Validate
    if (!chatId) {
      return res.status(400).json({ success: false, message: "chatId is required" });
    }

    // 2️⃣ Prevent crash if chatId is not a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ success: false, message: "Invalid chatId" });
    }

    // 3️⃣ Delete chat that belongs to the user
    const result = await Chat.deleteOne({ _id: chatId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Chat not found or unauthorized" });
    }

    res.json({ success: true, message: "Chat deleted" });

  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
