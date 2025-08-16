import React, { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) {
        return null;
      }
      
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      
      if (response.data.success) {
        // Keep full order structure instead of flattening to individual items
        const ordersWithDetails = response.data.orders.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
          }))
        }));
        
        setOrderData(ordersWithDetails.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);
  

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.map((order, orderIndex) => (
          <div
            key={order._id || orderIndex}
            className="py-6 border-t border-b text-gray-700 mb-4"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-semibold text-lg">Order #{order._id?.slice(-8) || orderIndex + 1}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString()} • {order.paymentMethod}
                </p>
              </div>
              
              <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">{order.status}</span>
                </div>
                
                {/* Order Total with Redemption Info */}
                <div className="text-right">
                  {order.appliedRedemption && order.originalAmount && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">₹{order.originalAmount}</span>
                      <span className="text-green-600 ml-2">
                        -{order.appliedRedemption.discountAmount ? `₹${order.appliedRedemption.discountAmount}` : 'Discount Applied'}
                      </span>
                    </div>
                  )}
                  <p className="font-semibold text-lg">
                    Total: {currency}{order.amount}
                  </p>
                  {order.appliedRedemption && (
                    <p className="text-xs text-blue-600">
                      Used: {order.appliedRedemption.code}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {order.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-start gap-4 p-3 bg-white rounded border"
                >
                  <img className="w-16 sm:w-20 rounded" src={item.images?.[0]} alt={item.name} />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>₹{item.price}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>Size: {item.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-end mt-4">
              <button 
                onClick={loadOrderData} 
                className="border border-gray-300 px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </div>
        ))}
        
        {orderData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
