import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const ChatBox = () => {
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    theme,
    createNewChat,
  } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text");
  const [inputText, setInputText] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const bottomRef = useRef(null);

  /* LOAD MESSAGES */
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* SEND MESSAGE */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!selectedChat) {
      await createNewChat();
      return;
    }

    const token = localStorage.getItem("token");

    const userPrompt = inputText;
    const userMessage = {
      role: "user",
      content: userPrompt,
      timestamp: Date.now(),
      isImage: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const url =
       mode === "image"
    ? `${API_BASE_URL}/api/chats/${selectedChat._id}/image`
    : `${API_BASE_URL}/api/chats/${selectedChat._id}/message`;


      const payload =
        mode === "image"
          ? { prompt: userPrompt, isPublished }
          : { prompt: userPrompt };

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const reply = res.data.reply;
        setMessages((prev) => [...prev, reply]);

        /* FRONTEND TITLE SYNC */
        if (
          selectedChat.chatname === "New Chat" &&
          selectedChat.messages?.length === 0
        ) {
          const newTitle = userPrompt
            .split(" ")
            .slice(0, 6)
            .join(" ")
            .slice(0, 30);

          // Update selectedChat
          const updatedChat = {
            ...selectedChat,
            chatname: newTitle,
            messages: [userMessage, reply],
          };

          setSelectedChat(updatedChat);

          // Update sidebar chats
          setChats((prev) =>
            prev.map((chat) =>
              chat._id === selectedChat._id
                ? { ...chat, chatname: newTitle }
                : chat
            )
          );
        }
      }
    } catch (error) {
      console.error("Message Send Error:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
      setIsPublished(false);
    }
  };

  return (
    <div className="p-5 h-screen flex flex-col text-black dark:text-white">
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-70">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              className="w-40 mb-4"
              alt="AskVision"
            />
            <p className="text-lg font-medium">Ask me anything...</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <Message key={i} message={msg} />
            ))}

            {loading && (
              <div className="flex items-start gap-3 my-4">
                <div className="max-w-[75%] p-4 rounded-2xl bg-gray-100 dark:bg-white/10">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="mt-4 p-4 rounded-xl bg-gray-100 dark:bg-white/10">
        <div className="flex gap-3 mb-3">
          <button type="button" onClick={() => setMode("text")} className={mode === "text" ? "bg-blue-600 text-white px-4 py-1 rounded" : "px-4 py-1 bg-gray-300 rounded"}>
            Text
          </button>
          <button type="button" onClick={() => setMode("image")} className={mode === "image" ? "bg-blue-600 text-white px-4 py-1 rounded" : "px-4 py-1 bg-gray-300 rounded"}>
            Image
          </button>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={mode === "image" ? "Describe image..." : "Type message..."}
          className="w-full p-3 rounded border bg-transparent"
        />

        {mode === "image" && (
          <label className="flex gap-2 text-sm mt-2">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Publish to community
          </label>
        )}

        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="mt-3 w-full py-2 bg-gradient-to-r from-[#A456F7] to-[#40B5F6] text-white rounded"
        >
          {mode === "image" ? "Generate Image" : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
