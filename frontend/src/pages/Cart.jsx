import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, cartCoinDiscounts } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      let removedProducts = [];
      
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            // Check if product still exists before adding to cart data
            const productExists = products.find(product => product._id === items);
            if (productExists) {
              tempData.push({
                _id: items,
                size: item,
                quantity: cartItems[items][item],
              });
            } else {
              // Track removed products for notification
              removedProducts.push({
                id: items,
                size: item,
                quantity: cartItems[items][item]
              });
              console.log(`Product ${items} no longer exists, removing from cart`);
              updateQuantity(items, item, 0);
            }
          }
        }
      }
      
      // Show notification if products were removed
      if (removedProducts.length > 0) {
        toast.warning(
          `${removedProducts.length} item(s) removed from cart - product(s) no longer available`,
          { autoClose: 5000 }
        );
      }
      
      setCartData(tempData);
    }
  }, [cartItems, products, updateQuantity]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          // If product data is not found, skip rendering this item
          if (!productData) {
            console.log(`Product data not found for item ${item._id}`);
            return null;
          }

          // Additional safety checks for product data
          if (!productData.images || !productData.images[0] || !productData.name || !productData.price) {
            console.log(`Incomplete product data for item ${item._id}`);
            return null;
          }

          // Check for coin discount
          const discountKey = `${item._id}_${item.size}`;
          const discountInfo = cartCoinDiscounts[discountKey];

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr]  sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.images[0]}
                  alt={productData.name || "Product"}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png'; // Fallback image
                  }}
                />
                <div>
                  <p className="text-sm sm:text-lg font-medium ">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <div className="flex flex-col">
                      {discountInfo ? (
                        <>
                          <p className="text-sm line-through text-gray-400">
                            {currency}{productData.price}
                          </p>
                          <p className="text-green-600 font-medium">
                            {currency}{discountInfo.discountedPrice}
                          </p>
                          <p className="text-xs text-yellow-600">
                            🪙 -{discountInfo.coinsUsed} coins
                          </p>
                        </>
                      ) : (
                        <p>
                          {currency}
                          {productData.price}
                        </p>
                      )}
                    </div>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="number"
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                min={1}
                defaultValue={item.quantity}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 "
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                alt="Remove item"
              />
            </div>
          );
        })}
      </div>

    {
      cartData.length > 0 ?   <div className="flex justify-end my-20">
      <div className="w-full sm:w-[450px]">
        <CartTotal coinDiscounts={cartCoinDiscounts} />
        <div className="w-full text-end">
          <button
            onClick={() => navigate("/place-order")}
            className="bg-black text-white text-sm my-8 px-8 py-3"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div> : <div className="text-4xl ">Cart Empty , Please Add Some Items 🥺</div>
    }
    </div>
  );
};

export default Cart;
