import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

const Payment = ({ amount, billingDetails, onPaymentSuccess }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [error, setError] = useState("");
  const userData = useSelector((state) => state.auth.user);
  const fullName = userData?.user?.fullName;
  const email = userData?.user?.email;
  const phoneNumber = userData?.user?.phoneNumber;

  const [address, setAddresses] = useState([]);

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const payment_Key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    setLoading(true);
    try {
      // Request order from backend
      const { data: order } = await axios.post(
        `${baseUrl}/api/v1/payment/create-order`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      // Razorpay Checkout
      const options = {
        key: payment_Key,
        amount: order.amount,
        currency: order.currency,
        name: "TrendyCart",
        description: "Product Payment",
        image: "/img/mydp.jpg", // Logo for the checkout popup
        order_id: order.id, // Order ID from backend
        handler: async function (response) {
          // Success callback
          alert("Payment Successful");
          console.log(response);

          // Send payment details to the backend for verification
          try {
            await axios.post(
              `${baseUrl}/api/v1/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount,
              },
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
              }
            );
            await handlePlaceOrder();
            const paymentId = response.razorpay_payment_id;
            console.log("paymentId: ", paymentId);

            await saveOrderDetails({
              paymentId,
              cart,
              billingDetails,
              totalPrice: amount,
            });
            dispatch(clearCart());
            alert("Payment Verified and Saved!");
          } catch (verificationError) {
            console.error("Error verifying payment:", verificationError);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phoneNumber,
        },
        notes: {
          address: billingDetails.address,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error while creating order", error);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      console.log("Order Placed:", {
        cart,
        billingDetails,
        totalPrice: amount,
      });

      // Send confirmation email
      await axios.post(
        `${baseUrl}/api/v1/payment/sendSucessMail`,
        {
          cart,
          billingDetails,
          totalPrice: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      // Clear cart
      dispatch(clearCart());
      alert("Order details sent to your mail! 🚀");
      navigate("/users/home");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  const saveOrderDetails = async (
    billingDetails,
    cart,
    totalPrice,
    paymentId
  ) => {
    try {
      // Log the request data
      console.log("Sending request:", {
        billingDetails,
        cart,
        totalPrice,
        paymentId,
      });

      // Send the POST request to save the order
      const response = await axios.post(
        `${baseUrl}/api/v1/orders/save-order`,
        {
          billingDetails, // Billing details
          cart, // Cart items
          totalPrice, // Total price of the order
          paymentId, // Payment ID
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`, // JWT token
          },
        }
      );

      // Handle the response
      if (response.data.success) {
        console.log(response.data.order);
        alert("Order placed successfully!");
      } else {
        alert("Error saving order. Please try again.");
      }
    } catch (error) {
      // Handle errors
      console.error("Error while saving the order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const getAllAddresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/v1/address/get`, {
        headers: getHeaders(),
      });
      setAddresses(response.data.data.allAddress || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-red-500 font-semibold">{error}</h3>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </>
  );
};

export default Payment;
