import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Credits from './pages/Credits';
import Community from './pages/Community';
import { assets } from './assets/assets';
import './assets/prism.css';
import Loading from './pages/Loading';
import { useAppContext } from './context/AppContext';
import Login from './pages/Login';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { pathname } = useLocation();   
  const { user } = useAppContext();

  // Show loading page
  if (pathname === '/loading') return <Loading />;
  if (!user) return <Login />;         

  return (
    <>
      {/* Mobile Menu Button */}
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="
            w-8 h-8 p-2 rounded-md shadow-md bg-white dark:bg-black/40
            fixed top-4 left-4 z-40 md:hidden 
            cursor-pointer active:scale-95 transition
            dark:invert
          "
          onClick={() => setIsMenuOpen(true)}
          alt="Open Menu"
        />
      )}

      {/* Main App UI */}
      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white min-h-screen w-screen">
        <div className="flex h-full w-full">

          {/* Sidebar */}
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          {/* Main Content */}
          <div className="flex-grow overflow-y-auto">
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route path="/loading" element={<Loading />} />
            </Routes>
          </div>

        </div>
      </div>
    </>
  );
};

export default App;
