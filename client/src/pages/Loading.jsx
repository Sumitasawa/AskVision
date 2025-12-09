import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

    </div>
  );
};

export default Loading;
