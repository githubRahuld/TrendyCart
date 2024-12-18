import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { updateQuantity, removeFromCart, clearCart } from "../store/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  console.log("Cart: ", cart);

  // Calculate total price
  const totalPrice = cart
    .reduce((total, item) => total + item.price * 84.87 * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="font-poppins p-4">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-700">Your cart is empty!</h3>
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => (window.location.href = "/")}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-24 h-24 object-cover mr-6"
                />
                <div className="flex-1 flex flex-col justify-start">
                  <h3 className="text-xl font-semibold text-left">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-left">{item.brand}</p>
                  {/* Rating and Reviews */}
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-lg font-semibold">
                      ⭐ {item.rating}
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">
                      ({item.reviews?.length || 0} Reviews)
                    </span>
                  </div>
                  <p className=" text-lg font-bold text-gray-800 text-left">
                    ₹{new Intl.NumberFormat("en-IN").format(item.price * 84.87)}
                  </p>
                  <div className="flex items-center mt-4 space-x-3">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="p-2 bg-gray-200 rounded-md"
                    >
                      <FaMinus />
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="p-2 bg-gray-200 rounded-md"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Price Details</h3>
            <div className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span>
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total Price:</span>
              <span>₹{new Intl.NumberFormat("en-IN").format(totalPrice)}</span>
            </div>
            <div className="space-y-4">
              <Link
                to="/users/checkout"
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-center block no-underline"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => dispatch(clearCart())}
                className="w-full py-3 px-6 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
