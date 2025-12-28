import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(user ? "/" : "/login");
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigate, user]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loading;
