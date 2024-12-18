import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-10 left-0 right-0 z-50 flex justify-center p-4 font-poppins">
      <div className="w-80 p-4 rounded-lg shadow-xl backdrop-blur-lg bg-white/30 text-black transform transition-all duration-300 ease-in-out scale-100 hover:scale-105 hover:shadow-2xl border border-red-400">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-black flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-xl text-gray-700 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
