import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // 🔥 Enable Dark Mode
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔥 Fetch user (Dummy for now)
  const fetchUser = async () => {
    setUser(dummyUserData);
  };

  // 🔥 Fetch user chats (Dummy for now)
  const fetchUserChat = async () => {
    setChats(dummyChats);
    setSelectedChat(null);
  };

  // Load chats whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserChat();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // Load user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // ⭐ CREATE NEW CHAT FUNCTION ⭐
  const createNewChat = () => {
    const newChat = {
      _id: Date.now().toString(),
      name: "New Chat",
      messages: [],
      updatedAt: new Date().toISOString(),
    };

    setChats((prev) => [newChat, ...prev]); // add on top
    setSelectedChat(newChat); // make new chat active
  };

  const value = {
    navigate,
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    createNewChat, 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
