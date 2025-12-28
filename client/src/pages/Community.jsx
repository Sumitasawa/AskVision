import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users/published-images`
      );

      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (error) {
      console.error(
        "Fetch Community Images Error:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">

      <h2 className="text-2xl font-semibold mb-4">Community Images</h2>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((item, index) => (
            <a
              key={index}
              href={item.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <img
                src={item.imageUrl}
                alt="Community"
                className="w-full h-60 object-cover rounded-xl shadow-md 
                           group-hover:opacity-90 transition"
              />

              <p className="mt-2 text-sm opacity-70">
                Created By{" "}
                <span className="font-medium">
                  {item.userName || "Anonymous"}
                </span>
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-300">
          No images available.
        </p>
      )}
    </div>
  );
};

export default Community;
