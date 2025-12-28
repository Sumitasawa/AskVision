import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();

  const {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    user,
    createNewChat,
    logout,
  } = useAppContext();

  const [search, setSearch] = useState("");

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // REAL DELETE
  const deleteChat = async (chatId) => {
    if (!chatId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Delete failed:", data.message);
        return;
      }

      setChats((prev) => prev.filter((c) => c._id !== chatId));

      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Delete chat failed", error);
    }
  };

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-screen min-w-72 p-6
        bg-white dark:bg-[#121212]/70 backdrop-blur-2xl
        shadow-xl md:shadow-none border-r border-gray-200 dark:border-white/10
        transition-all duration-300 ease-out z-40
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Mobile Close */}
      <img
        src={assets.close_icon}
        alt="Close"
        onClick={() => setIsMenuOpen(false)}
        className="md:hidden w-7 h-7 absolute top-5 right-5 cursor-pointer dark:invert"
      />

      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="AskVision"
        className="w-40 mb-6 cursor-pointer"
        onClick={() => handleMenuClick("/")}
      />

      {/* New Chat */}
      <button
        onClick={() => {
          createNewChat();
          navigate("/");
          setIsMenuOpen(false);
        }}
        className="w-full py-2.5 mb-4 flex items-center justify-center gap-2
                   bg-gradient-to-r from-[#A456F7] to-[#40B5F6]
                   text-white font-medium rounded-lg hover:opacity-90"
      >
        <span className="text-xl">+</span> New Chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-white/5 
                      border border-gray-300 dark:border-white/10 rounded-lg mb-5">
        <img src={assets.search_icon} className="w-4 dark:invert" />
        <input
          type="text"
          placeholder="Search chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Chats */}
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
        Recent Chats
      </p>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {chats
          .filter((chat) =>
            chat.chatname?.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                navigate("/");
                setIsMenuOpen(false);
              }}
              className="group p-3 bg-gray-100 dark:bg-white/5 border 
                         border-gray-300 dark:border-white/10 rounded-lg 
                         flex justify-between items-center cursor-pointer 
                         hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
              <div className="w-full">
                <p className="truncate font-medium text-sm">
                  {chat.chatname || "New Chat"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {chat.updatedAt
                    ? moment(chat.updatedAt).fromNow()
                    : "Recently"}
                </p>
              </div>

              {/* Delete */}
              <img
                src={assets.bin_icon}
                alt="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                className="hidden group-hover:block w-4 dark:invert cursor-pointer"
              />
            </div>
          ))}
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-300 dark:border-white/10" />

      {/*Community Images */}
      <div
        onClick={() => handleMenuClick("/community")}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 
                   dark:hover:bg-white/10 cursor-pointer"
      >
        <img src={assets.gallery_icon} className="w-5 dark:invert" />
        <span className="text-sm">Community Images</span>
      </div>

      {/* Credits */}
      <div
        onClick={() => handleMenuClick("/credits")}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 
                   dark:hover:bg-white/10 cursor-pointer"
      >
        <img src={assets.diamond_icon} className="w-5 dark:invert" />
        <span className="text-sm">
          Credits: {user?.credits ?? 0}
        </span>
      </div>

      {/* Theme Toggle */}
      <div
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 
                   dark:hover:bg-white/10 cursor-pointer"
      >
        <span className="text-xl">{theme === "dark" ? "🌞" : "🌙"}</span>
        <span className="text-sm">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </div>

      {/* User / Logout */}
      <div
        className="flex items-center justify-between p-3 mt-5 bg-gray-100 
                   dark:bg-white/5 border border-gray-300 dark:border-white/10 
                   rounded-lg"
      >
        <div className="flex items-center gap-3">
          <img src={assets.user_icon} className="w-6 dark:invert" />
          <p className="text-sm truncate">{user?.name}</p>
        </div>

        <img
          src={assets.logout_icon}
          className="w-5 cursor-pointer dark:invert"
          onClick={logout}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
