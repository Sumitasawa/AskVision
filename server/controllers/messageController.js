import axios from "axios";
import imagekit from "../configs/ImageKit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper: call Gemini text model via REST API
async function generateTextWithGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const { data } = await axios.post(url, payload);

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join(" ")
      .trim() || "";

  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return text;
}





// ============================================================================
// 📌 TEXT MESSAGE CONTROLLER — GEMINI (REST) + FIXED chatId handling
// ============================================================================

export const messageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1) Credit check
    if (req.user.credits < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough credits" });
    }

    // 2) chatId from URL params, prompt from body
    const chatId = req.params.chatId;
    const { prompt } = req.body;

    if (!prompt || !chatId) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt & chatId required" });
    }

    // 3) Find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // 4) Prepare user message
    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    };

    // 5) Call Gemini via REST
    let aiText;
    try {
      aiText = await generateTextWithGemini(prompt);
    } catch (err) {
      console.error("Gemini Error:", err?.response?.data || err.message);
      return res.status(500).json({
        success: false,
        message: "AI did not respond properly"
      });
    }

    // 6) Build assistant message
    const reply = {
      role: "assistant",
      content: aiText,
      timestamp: Date.now(),
      isImage: false
    };

    // 7) Respond quickly to frontend
    res.json({ success: true, reply });

    // 8) Save messages + update credits (after response)
    chat.messages.push(userMessage);
    chat.messages.push(reply);
    chat.updatedAt = Date.now();

    await Promise.all([
      chat.save(),
      User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
    ]);
  } catch (error) {
    console.error("Message Error:", error?.response?.data || error.message);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// ============================================================================
// 📌 IMAGE MESSAGE CONTROLLER — SAME AS BEFORE, chatId from params
// ============================================================================

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Credit check
    if (req.user.credits < 2) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough credits" });
    }

    const chatId = req.params.chatId;
    const { prompt, isPublished } = req.body;

    if (!prompt || !chatId) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt & chatId required" });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // User message
    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    };

    // Prepare prompt for ImageKit
    const safePrompt = encodeURI(prompt.trim().replace(/\s+/g, "-"));

    // Generate AI image using ImageKit URL-based generation
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${safePrompt}/askvision/${Date.now()}.png?tr=w-800,h-800`;

    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer"
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data
    ).toString("base64")}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "askvision"
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished: Boolean(isPublished)
    };

    // Respond immediately
    res.json({ success: true, reply });

    // Save in DB + deduct credits
    chat.messages.push(userMessage);
    chat.messages.push(reply);
    chat.updatedAt = Date.now();

    await Promise.all([
      chat.save(),
      User.updateOne({ _id: userId }, { $inc: { credits: -2 } })
    ]);
  } catch (error) {
    console.error("Image Error:", error?.response?.data || error.message);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};
