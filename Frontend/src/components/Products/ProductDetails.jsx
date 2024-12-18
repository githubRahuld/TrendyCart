import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import Notification from "../Notification";
import LoginPopup from "../LoginPopup";

const ProductDetails = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  // Add a product to the cart
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setIsLoginPopupOpen(true); // Show login popup if the user is not logged in
    } else {
      dispatch(addToCart(product)); // Add product to cart if logged in
      setShowMessage(true); // Show message that product was added
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleClosePopup = () => {
    setIsLoginPopupOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Image Section */}
      <div className="lg:col-span-5 flex flex-col items-center space-y-4">
        {/* Display the selected image */}
        <img
          src={selectedImage}
          alt={product.title}
          className="w-full max-w-xs object-contain rounded-lg mb-4"
        />
        <div className="flex space-x-2 overflow-x-auto">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product Image ${index}`}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-transform transform hover:scale-110 duration-300"
              onClick={() => setSelectedImage(image)} // Set image on click
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="lg:col-span-7">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          {product.title}
        </h1>
        <p className="text-sm text-justify text-gray-700 mb-4">
          {product.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-4">
          <span className="text-yellow-500 text-lg font-semibold">
            ⭐ {product.rating}
          </span>
          <span className="ml-2 text-gray-500 text-sm">
            ({product.reviews?.length || 0} Reviews)
          </span>
        </div>

        {/* Availability and SKU */}
        <div className="flex gap-6 mb-4 text-sm text-gray-600">
          <p>
            <strong className="font-semibold">Availability:</strong>{" "}
            <span className="text-gray-700">{product.availabilityStatus}</span>
          </p>
          <p>
            <strong className="font-semibold">SKU:</strong>{" "}
            <span className="text-gray-700">{product.sku}</span>
          </p>
        </div>

        <div className="flex flex-col">
          {/* Price Section */}
          <p className="text-2xl font-extrabold text-green-600 mb-4">
            ₹
            {new Intl.NumberFormat("en-IN", {
              maximumFractionDigits: 0,
            }).format(product.price * 84.87)}
          </p>
          {/* Action Button */}
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

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

export default ProductDetails;
