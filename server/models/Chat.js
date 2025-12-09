import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true }, // "user" | "assistant"
    content: { type: String, required: true },
    isImage: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true
    },
    chatname: {
      type: String,
      required: true
    },
    messages: [MessageSchema] 
  },
  {
    timestamps: true 
  }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
