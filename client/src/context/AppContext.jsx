import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  /* THEME */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* LOAD USER */
  const loadUser = async () => {
    try {
      const res = await api.get("/api/users/me");
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  /* AUTH */
  const loginUser = async (email, password) => {
    try {
      const res = await api.post("/api/users/login", { email, password });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
        return { success: true };
      }
      return res.data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const res = await api.post("/api/users/register", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        await loadUser();
        navigate("/");
        return { success: true };
      }
      return res.data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    navigate("/login");
  };

  /* FETCH CHATS */
  const fetchChats = async () => {
    try {
      const res = await api.get("/api/chats");
      if (res.data.success) {
        setChats(res.data.chats);

        // Auto-select latest chat
        if (!selectedChat && res.data.chats.length > 0) {
          setSelectedChat(res.data.chats[0]);
        }
      }
    } catch (err) {
      console.log("Fetch Chats Error:", err);
    }
  };

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  /* CREATE NEW CHAT */
  const createNewChat = async () => {
    try {
      const res = await api.post("/api/chats");

      if (res.data.success) {
        // IMPORTANT: refetch real chats
        await fetchChats();
      }
    } catch (err) {
      console.log("Create Chat Error:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logout,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        createNewChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
