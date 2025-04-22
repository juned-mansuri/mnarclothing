import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [modalImage, setModalImage] = useState(null); // 🔍 Modal Image

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-5 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Page</h2>

      {/* MODAL */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative bg-white rounded-md p-4 max-w-xl w-full"
            onClick={(e) => e.stopPropagation()} // prevent close on modal click
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt="Product"
              className="w-full h-auto rounded object-contain"
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-6 border rounded-xl bg-white p-6 shadow-sm"
          >
            {/* Order & Address Section */}
            <div>
              {/* Products */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 rounded-md object-cover border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => setModalImage(item.images[0])}
                    />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold">{item.name}</p>
                      <p>
                        Qty: {item.quantity}{" "}
                        <span className="ml-2">Size: {item.size}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="mt-5 text-sm text-gray-600">
                <p className="font-medium">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </p>
                <p>{order.address.phone}</p>
              </div>
            </div>

            {/* Order Info */}
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium">Items:</span> {order.items.length}
              </p>
              <p>
                <span className="font-medium">Method:</span> {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.payment ? "Done" : "Pending"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>

            {/* Amount */}
            <div className="text-lg font-semibold text-green-700 flex items-center">
              ₹ {order.amount}
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center">
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="w-full p-2 rounded-md border font-medium bg-white shadow-sm"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
  