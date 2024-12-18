import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import Notification from "./Notification";
import SkeletonLoading from "./SkeletonLoading";
import LoginPopup from "./LoginPopup";

const ProductList = ({ products }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  console.log(isLoggedIn);

  // Navigate to the product details page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Add a product to the cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setShowMessage(true);
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
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
    <div className="container mx-auto px-4 mt-4">
      {!products ? (
        <SkeletonLoading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <div onClick={() => handleProductClick(product.id)}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-40 object-contain rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg text-gray-800 truncate mb-2">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                <p className="text-black font-poppins font-bold text-lg">
                  ₹
                  {new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 0,
                  }).format(product.price * 84.87)}
                </p>
              </div>
              {!isLoggedIn ? (
                <button
                  onClick={handleOpenPopup}
                  className="bg-blue-600 mb-4 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 mb-4 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {showMessage && (
        <Notification
          message="Product added to cart!"
          onClose={handleCloseMessage}
        />
      )}

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginPopupOpen} onClose={handleClosePopup} />
    </div>
  );
};

export default ProductList;
