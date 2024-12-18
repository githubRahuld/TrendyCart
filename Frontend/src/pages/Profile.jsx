import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEdit, FaTrash, FaUserEdit } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import OrderDetails from "../components/OrderDetails";

const Profile = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [editDetails, setEditDetails] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  });

  const fetchUser = async () => {
    setLoading(true);

    await axios
      .get(`${baseUrl}/api/v1/auth/getUser`, {
        headers: getHeaders(),
      })
      .then((response) => {
        setUser(response.data.data.user);
        setEditDetails(response.data.data.user);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });
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

  const updateUserDetails = async () => {
    setLoading(true);
    try {
      await axios.patch(`${baseUrl}/api/v1/auth/update`, editDetails, {
        headers: getHeaders(),
      });
      fetchUser();
    } catch (error) {
      console.error("Failed to update user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      await axios.patch(`${baseUrl}/api/v1/auth/update-avatar`, formData, {
        headers: { ...getHeaders(), "Content-Type": "multipart/form-data" },
      });
      fetchUser();
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/v1/address/create`, newAddress, {
        headers: getHeaders(),
      });
      getAllAddresses();
      setNewAddress({
        addressLine1: "",
        addressLine2: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
      });
    } catch (error) {
      console.error("Failed to add address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (addressId, updatedAddress) => {
    setLoading(true);
    try {
      await axios.patch(
        `${baseUrl}/api/v1/address/update/${addressId}`,
        updatedAddress,
        {
          headers: getHeaders(),
        }
      );
      getAllAddresses();
    } catch (error) {
      console.error("Failed to update address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/api/v1/address/delete/${id}`, {
        headers: getHeaders(),
      });
      getAllAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/orders/all-orders`, {
        headers: getHeaders(),
      });
      if (response.data.success) {
        const ordersData = response.data.orders;

        // Fetch product details for all items in orders
        const productFetchPromises = ordersData.flatMap((order) =>
          order.items.map((item) =>
            axios
              .get(`https://dummyjson.com/products/${item.id}`)
              .then((res) => ({ id: item.id, details: res.data }))
              .catch((error) => {
                console.error(
                  `Failed to fetch product with id ${item.id}:`,
                  error
                );
                return { id: item.id, details: null }; // Fallback for failed fetch
              })
          )
        );

        const productDetailsArray = await Promise.all(productFetchPromises);
        const productDetailsMap = productDetailsArray.reduce((acc, curr) => {
          if (curr.details) acc[curr.id] = curr.details;
          return acc;
        }, {});

        setProductDetails(productDetailsMap);
        setOrders(ordersData);
      } else {
        alert("Error fetching orders. Please try again.");
      }
    } catch (error) {
      console.error("Error while fetching orders:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
    getAllAddresses();
    getAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-5xl" />
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 py-12 mt-20 space-y-12 bg-gray-100">
      {/* Profile Section */}
      <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:scale-[1.02] space-y-6">
        {/* Section Title */}
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaUserEdit className="text-blue-600" />
          Profile
        </h1>

        {/* Avatar and Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <img
              src={user?.avatar || "/img/dp.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full shadow-md object-cover border-4 border-blue-600"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700"
            />
            <button
              onClick={handleAvatarUpload}
              className="w-full py-2 px-6 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              Update Avatar
            </button>
          </div>

          {/* User Details Section */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name Field */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={editDetails.fullName}
                  onChange={(e) =>
                    setEditDetails({ ...editDetails, fullName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  onClick={updateUserDetails}
                  className="py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={editDetails.phoneNumber}
                  onChange={(e) =>
                    setEditDetails({
                      ...editDetails,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  onClick={updateUserDetails}
                  className="py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Addresses</h2>

        {addresses.map((address) => (
          <div
            key={address._id}
            className="flex items-center justify-between border-b pb-4 mb-4"
          >
            <p className="text-lg text-gray-700">{`${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country}`}</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  handleUpdateAddress(address._id, {
                    ...address,
                    city:
                      prompt("Enter new city", address.city) || address.city,
                  })
                }
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteAddress(address._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Address */}
        <div>
          <h3 className="text-lg font-bold mb-4">Add New Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(newAddress).map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={newAddress[field]}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [field]: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              />
            ))}
          </div>
          <button
            onClick={handleAddAddress}
            className="mt-6 py-3 px-8 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transition"
          >
            Add Address
          </button>
        </div>
      </div>

      {/* Order Details */}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderDetails
              key={order._id}
              order={order}
              productDetails={productDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
