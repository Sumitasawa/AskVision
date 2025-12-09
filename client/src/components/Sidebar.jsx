import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    navigate,
    chats,
    setChats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    createNewChat,
  } = useAppContext();

  const [search, setSearch] = useState("");

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Delete chat
  const deleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c._id !== id));
    setSelectedChat((prev) => (prev?._id === id ? null : prev));
  };

  return (
    <div
      className={`
        fixed md:static top-0 left-0 h-screen min-w-72 p-6
        bg-white dark:bg-[#121212]/70 backdrop-blur-2xl
        shadow-xl md:shadow-none border-r border-gray-200 dark:border-white/10
        transition-all duration-300 ease-out z-40
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Mobile Close Button */}
      <img
        src={assets.close_icon}
        onClick={() => setIsMenuOpen(false)}
        className="md:hidden w-7 h-7 absolute top-5 right-5 bg-black/10 dark:bg-white/10 
                   p-1 rounded-full cursor-pointer dark:invert"
      />

      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        className="w-40 mb-6"
      />

      {/* New Chat Button */}
      <button
        onClick={() => {
          createNewChat();
          setIsMenuOpen(false);
        }}
        className="w-full py-2.5 mb-4 flex items-center justify-center gap-2
                   bg-gradient-to-r from-[#A456F7] to-[#40B5F6]
                   text-white font-medium rounded-lg shadow hover:opacity-90"
      >
        <span className="text-xl">+</span> New Chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-white/5 
                      border border-gray-300 dark:border-white/10 rounded-lg mb-5">
        <img src={assets.search_icon} className="w-4 dark:invert" />
        <input
          type="text"
          placeholder="Search Conversations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Recent Chats */}
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
        Recent Chats
      </p>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {chats
          .filter((chat) => {
            const q = search.toLowerCase();
            const msg = chat.messages?.[0]?.content?.toLowerCase() || "";
            return msg.includes(q);
          })
          .map((chat) => (
            <div
              key={chat._id}
              className="group p-3 bg-gray-100 dark:bg-white/5 border 
                         border-gray-300 dark:border-white/10 rounded-lg 
                         flex justify-between items-center cursor-pointer 
                         hover:bg-gray-200 dark:hover:bg-white/10 transition"
              onClick={() => {
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
            >
              <div className="w-full">
                <p className="truncate font-medium text-sm text-gray-700 dark:text-white">
                  {chat.messages?.[0]?.content?.slice(0, 32) || "New Chat"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {chat.updatedAt ? moment(chat.updatedAt).fromNow() : "Recently"}
                </p>
              </div>

              {/* Delete icon */}
              <img
                src={assets.bin_icon}
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
      <div className="my-5 border-t border-gray-300 dark:border-white/10"></div>

      {/* Community Images */}
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
                   dark:hover:bg-white/10 cursor-pointer mt-1"
      >
        <span className="text-xl">{theme === "dark" ? "🌞" : "🌙"}</span>
        <span className="text-sm">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </div>

      {/* User Section */}
      <div
        className="flex items-center justify-between p-3 mt-5 bg-gray-100 
                   dark:bg-white/5 border border-gray-300 dark:border-white/10 
                   rounded-lg"
      >
        <div className="flex items-center gap-3">
          <img src={assets.user_icon} className="w-6 dark:invert" />
          <p className="text-sm">{user?.name || "Login your account"}</p>
        </div>

        {user && (
          <img
            src={assets.logout_icon}
            className="w-5 cursor-pointer hover:opacity-75 invert" 
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
              setIsMenuOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
