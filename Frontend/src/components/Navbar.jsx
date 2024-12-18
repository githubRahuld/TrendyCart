import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/authSlice.js";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import LoginPopup from "./LoginPopup.jsx";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaShoppingCart,
} from "react-icons/fa";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); // state for login popup visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const userData = useSelector((state) => state?.auth?.user);

  // console.log("userData at state: ", userData);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async (e) => {
    await axios
      .post(
        `${baseUrl}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        dispatch(logoutUser());
        navigate("/auth/login");
      })
      .catch((err) => {
        if (err.response?.status === 411) {
          dispatch(logoutUser());
          navigate("/auth/login");
        }
        console.log(err);
      });
  };

  const handleOpenPopup = () => {
    if (!isLoggedIn) {
      setIsLoginPopupOpen(true); // Show login popup
    }
  };

  const handleClosePopup = () => {
    setIsLoginPopupOpen(false);
  };

  return (
    <nav className="bg-gray-100 text-black px-4 py-3 fixed top-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between">
        {/* Title */}
        <Link
          to="/"
          className="text-3xl font-bold text-indigo-500 no-underline"
          style={{ fontFamily: "Fascinate Inline" }}
        >
          TrendyCart
        </Link>

        {/* Search Bar */}
        {isLoggedIn && (
          <div className="flex items-center bg-blue-100 p-2 rounded-lg space-x-2 w-32 lg:w-96">
            <FaSearch className="text-black" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-black placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
        )}

        {/* Hamburger Icon */}
        <button
          className="lg:hidden text-black text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Profile Options (Large Screens) */}
        <div className="hidden lg:flex bg-gray-100 items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/users/profile"
                className="flex items-center no-underline space-x-2 text-black border border-black rounded-xl p-2 hover:text-gray-400 hover:bg-blue-100"
              >
                <FaUserCircle />
                <span>Profile</span>
              </Link>
              <Link
                to="/users/cart"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white no-underline"
              >
                <FaShoppingCart />
                <span>Cart</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white no-underline justify-center"
              >
                Login
              </Link>
              <Link
                to="/auth/sign-up"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white no-underline justify-center"
              >
                Register
              </Link>
            </>
          )}
          {/* Cart Button for Non-Logged In Users */}
          {!isLoggedIn && (
            <button
              onClick={handleOpenPopup}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white no-underline"
            >
              <FaShoppingCart />
              <span>Cart</span>
            </button>
          )}
        </div>
      </div>
      {/* Profile Options (Mobile Menu) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-100 mt-2 p-4 rounded-lg shadow-md">
          {isLoggedIn ? (
            <>
              <Link
                to="/users/profile"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white no-underline justify-center mb-2"
                onClick={toggleMenu}
              >
                <FaUserCircle className="text-xl" />
                <span>Profile</span>
              </Link>

              <Link
                to="/users/cart"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white no-underline justify-center mb-2"
                onClick={toggleMenu}
              >
                <FaShoppingCart className="text-white" />
                <span>Cart</span>
              </Link>

              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg w-full justify-center"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white no-underline justify-center"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/auth/sign-up"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white no-underline justify-center mt-2"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
      {/* Login Popup */}
      <LoginPopup isOpen={isLoginPopupOpen} onClose={handleClosePopup} />
    </nav>
  );
};

export default Navbar;
