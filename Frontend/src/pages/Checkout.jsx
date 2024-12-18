import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Payment from "./Payment";
import axios from "axios";
import Cookies from "js-cookie";
import { clearCart } from "../store/cartSlice";

const Checkout = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [address, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cart = useSelector((state) => state.cart);
  const userData = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const totalPrice = cart
    .reduce((total, item) => total + item.price * 84.87 * item.quantity, 0)
    .toFixed(2);

  const [billingDetails, setBillingDetails] = useState({
    name: userData?.user?.fullName || "",
    email: userData?.user?.email || "",
    phone: userData?.user?.phoneNumber || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Fetch all addresses on component mount
  useEffect(() => {
    getAllAddresses();
  }, []);

  const getAllAddresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/v1/address/get`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      setAddresses(response.data.data.allAddress || []);
      console.log(address);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (selectedId) => {
    const selectedAddress = address.find((addr) => addr._id === selectedId);
    if (selectedAddress) {
      setBillingDetails((prev) => ({
        ...prev,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBillingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateBillingDetails = () => {
    // Exclude addressLine2 from validation
    const requiredFields = { ...billingDetails };
    delete requiredFields.addressLine2;

    // Check for empty fields
    if (Object.values(requiredFields).some((field) => field.trim() === "")) {
      setError("Please fill out all required billing fields.");

      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      setError("Please enter a valid email address.");

      return false;
    }

    // Validate phone number (10-digit Indian number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(billingDetails.phone)) {
      setError("Please enter a valid 10-digit phone number.");

      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateBillingDetails()) return;

    try {
      console.log("Order Placed:", {
        cart,
        billingDetails,
        totalPrice,
      });

      // Send the confirmation email
      await axios.post(
        `${baseUrl}/api/v1/payment/sendSucessMail`,
        {
          cart,
          billingDetails,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      // Dispatch action to clear the cart
      dispatch(clearCart());

      alert("Order details sent to your mail ! 🚀");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      setError(
        "Something went wrong while processing your order. Please try again."
      );
    }
  };
  useEffect(() => {
    // Automatically select the first address if it exists
    if (address.length > 0) {
      const firstAddress = address[0];
      setBillingDetails((prev) => ({
        ...prev,
        addressLine1: firstAddress.addressLine1,
        addressLine2: firstAddress.addressLine2,
        city: firstAddress.city,
        state: firstAddress.state,
        pincode: firstAddress.pincode,
      }));
    }
  }, [address]);

  return (
    <div className="container py-12 font-poppins mt-20 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 underline">
        Checkout
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="text-lg font-bold">
                ₹{(item.price * 84.87 * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
            <span className="text-lg font-semibold text-gray-700">
              Total Items:{" "}
              <span className="text-xl font-bold text-blue-600">
                {cart.length}
              </span>
            </span>
            <span className="text-lg font-semibold text-gray-700">
              Total:{" "}
              <span className="text-xl font-bold text-green-600">
                ₹{new Intl.NumberFormat("en-IN").format(totalPrice)}
              </span>
            </span>
          </div>
        </div>

        {/* Billing Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
          {loading ? (
            <p>Loading addresses...</p>
          ) : (
            <select
              onChange={(e) => handleAddressSelect(e.target.value)}
              className="w-full p-3 border bg-blue-100 border-gray-300 rounded-lg mb-4"
            >
              <option value="">Select an Address</option>
              {address.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.addressLine1}, {address.city}, {address.pincode}
                </option>
              ))}
            </select>
          )}

          <form className="space-y-4">
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.addressLine1}
              readOnly
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.addressLine2}
              readOnly
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.city}
              readOnly
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.state}
              readOnly
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.pincode}
              readOnly
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={billingDetails.phone}
              onChange={handleInputChange}
              required
            />
          </form>
          {error && <h1 className="font-semibold text-red-500">{error}</h1>}
          <Payment
            amount={totalPrice}
            billingDetails={billingDetails}
            onPaymentSuccess={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
