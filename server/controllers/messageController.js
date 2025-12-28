import axios from "axios";
import mongoose from "mongoose";
import imagekit from "../configs/ImageKit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/* 
   GEMINI TEXT WITH CONTEXT
 */
async function generateTextWithGemini(prompt, chat) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_API_KEY}`;

  // Use last 10 messages as context
  const contextMessages = chat.messages.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const payload = {
    contents: [
      ...contextMessages,
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const { data } = await axios.post(url, payload);

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join(" ")
      .trim() || "";

  if (!text) throw new Error("Gemini returned empty response");

  return text;
}

/* TEXT MESSAGE CONTROLLER */

export const messageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatId;
    const { prompt } = req.body;

    if (!prompt || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Prompt and chatId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chatId",
      });
    }

    // Deduct 1 credit atomically
    const creditResult = await User.updateOne(
      { _id: userId, credits: { $gte: 1 } },
      { $inc: { credits: -1 } }
    );

    if (!creditResult.modifiedCount) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // CHAT TITLE 
    if (chat.chatname === "New Chat" && chat.messages.length === 0) {
      chat.chatname = prompt
        .split(" ")
        .slice(0, 6)
        .join(" ")
        .slice(0, 30);
    }

    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    };

    let aiText;
    try {
      aiText = await generateTextWithGemini(prompt, chat);
    } catch (err) {
      console.error("Gemini Error:", err.message);
      return res.status(500).json({
        success: false,
        message: "AI failed to respond",
      });
    }

    const reply = {
      role: "assistant",
      content: aiText,
      timestamp: Date.now(),
      isImage: false,
    };

    // Respond immediately
    res.json({ success: true, reply });

    // Save async
    chat.messages.push(userMessage, reply);
    chat.updatedAt = Date.now();
    await chat.save();

  } catch (error) {
    console.error("Message Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* IMAGE MESSAGE CONTROLLER (IMAGEKIT) */

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatId;
    const { prompt, isPublished } = req.body;

    if (!prompt || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Prompt and chatId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chatId",
      });
    }

    // Deduct 2 credits atomically
    const creditResult = await User.updateOne(
      { _id: userId, credits: { $gte: 2 } },
      { $inc: { credits: -2 } }
    );

    if (!creditResult.modifiedCount) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // CHAT TITLE
    if (chat.chatname === "New Chat" && chat.messages.length === 0) {
      chat.chatname = prompt
        .split(" ")
        .slice(0, 6)
        .join(" ")
        .slice(0, 30);
    }

    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    };

    const safePrompt = encodeURIComponent(prompt.trim());
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${safePrompt}/askvision/${Date.now()}.png?tr=w-800,h-800`;

    const aiImage = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImage.data
    ).toString("base64")}`;

    const upload = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "askvision",
    });

    const reply = {
      role: "assistant",
      content: upload.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished: Boolean(isPublished),
    };

    // Respond immediately
    res.json({ success: true, reply });

    // Save async
    chat.messages.push(userMessage, reply);
    chat.updatedAt = Date.now();
    await chat.save();

  } catch (error) {
    console.error("Image Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
