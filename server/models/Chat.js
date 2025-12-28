import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    isImage: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
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
      default: "New Chat"
    },
    messages: [MessageSchema]
  },
  { timestamps: true }
);
ChatSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("Chat", ChatSchema);

