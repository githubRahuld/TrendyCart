import React from "react";

const OrderDetails = ({ order, productDetails }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md border mb-6 hover:shadow-lg transition-shadow">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b pb-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order ID: {order._id}
          </h3>
          <p className="text-sm text-gray-500">
            Placed on: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          <span
            className={`px-3 py-1 rounded-md text-sm font-semibold ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h4 className="text-md font-semibold text-gray-700 mb-3">Items:</h4>
        <ul className="space-y-4">
          {order.items.map((item) => {
            const product = productDetails[item.id] || {};
            return (
              <li
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-md border"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <img
                    src={product.thumbnail || "/img/placeholder.png"}
                    alt={product.title || "Product"}
                    className="w-16 h-16 rounded-md border object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {product.title || "Product not found"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-md font-bold text-gray-800 mt-2 sm:mt-0">
                  ₹{" "}
                  {new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 0,
                  }).format(product.price * 84.87 * item.quantity)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Total and Address */}
      <div className="mt-6 border-t pt-4">
        <p className="text-md font-semibold text-gray-800">
          Total Price:{" "}
          <span className="font-bold">
            ₹{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumFractionDigits: 0,
            }).format(order.orderPrice)}
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Delivery Address:</strong> {order.address.addressLine1},{" "}
          {order.address.city}, {order.address.state}, {order.address.country} -{" "}
          {order.address.pincode}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
