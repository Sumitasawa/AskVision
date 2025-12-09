import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const ChatBox = () => {
  const { selectedChat, theme } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Input states
  const [mode, setMode] = useState("text"); // "text" | "image"
  const [inputText, setInputText] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const bottomRef = useRef(null);

  // Load messages
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // SEND Handler
  const handleSend = (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    // User message
    const newMessage = {
      role: "user",
      content: inputText,
      timestamp: Date.now(),
      generateImage: mode === "image",
      publish: isPublished,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Reset states
    setInputText("");
    setIsPublished(false);

    // AI response loading
    setLoading(true);

    setTimeout(() => {
      // Fake AI Logic
      const aiMessage =
        mode === "image"
          ? {
              role: "assistant",
              isImage: true,
              content: assets.sample_image, // Later replace with actual generated image URL
              timestamp: Date.now(),
            }
          : {
              role: "assistant",
              content: "Generated text response.",
              timestamp: Date.now(),
            };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-5 h-screen flex flex-col text-black dark:text-white">

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pr-2">

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-70">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              className="w-40 mb-4"
              alt="AskVision Logo"
            />
            <p className="text-lg font-medium text-center">
              Ask me anything...
            </p>
          </div>
        )}

        {/* Render Messages */}
        {messages.length > 0 && (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <Message key={i} message={msg} />
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex items-start gap-3 my-4">
                <div className="max-w-[75%] p-4 rounded-2xl shadow-sm 
                                bg-gray-100 dark:bg-white/10 rounded-bl-none">
                  <div className="flex gap-2 items-center">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-white/40 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-white/40 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-white/40 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT SECTION */}
      <form onSubmit={handleSend} className="mt-4 bg-gray-100 dark:bg-white/10 p-4 rounded-xl">

        {/* Toggle Buttons */}
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition
              ${mode === "text"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-white/20 text-black dark:text-white"}`}
          >
            Text
          </button>

          <button
            type="button"
            onClick={() => setMode("image")}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition
              ${mode === "image"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-white/20 text-black dark:text-white"}`}
          >
            Image
          </button>
        </div>

        {/* TEXT INPUT FOR BOTH MODES */}
        <div className="flex flex-col gap-3">

          {/* Prompt Input */}
          <input
            type="text"
            placeholder={
              mode === "image"
                ? "Describe the image you want to generate..."
                : "Type your message..."
            }
            className="w-full bg-transparent outline-none text-sm dark:placeholder-white/40 p-3 rounded-lg border border-gray-300 dark:border-white/10"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {/* Checkbox only for Image Mode */}
          {mode === "image" && (
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              Publish generated image to community
            </label>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#A456F7] to-[#40B5F6]
                      text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            {mode === "image" ? "Generate Image" : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
