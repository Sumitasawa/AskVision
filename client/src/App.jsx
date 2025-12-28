import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAppContext } from "./context/AppContext";
import { assets } from "./assets/assets";

import "./assets/prism.css";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAppContext();

  if (pathname === "/loading") {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-right" />

      {/* Mobile Menu Button */}
      {!isMenuOpen && user && (
        <img
          src={assets.menu_icon}
          alt="Open Menu"
          className="
            w-8 h-8 p-2 rounded-md shadow-md
            bg-white dark:bg-black/40
            fixed top-4 left-4 z-40 md:hidden
            cursor-pointer active:scale-95
            transition dark:invert
          "
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white min-h-screen w-screen">
        <div className="flex h-screen w-full overflow-hidden">
          {user && (
            <Sidebar
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          )}

          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ChatBox />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />

              <Route path="/loading" element={<Loading />} />

              <Route
                path="/credits"
                element={
                  <ProtectedRoute>
                    <Credits />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
