import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null; // If not open, return nothing

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Login to Access Cart</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
