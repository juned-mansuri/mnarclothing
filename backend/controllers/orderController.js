import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"; // Import product model
import { awardPurchaseCoins, applyRedemptionCode } from "./coinController.js"; // Import coin functionality
import Stripe from "stripe";
import razorpay from "razorpay";
import crypto from "crypto";

// Global variables
const currency = "inr";
const deliveryCharge = 59;

// Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to update product stock
// Updated updateProductStock function
const updateProductStock = async (items) => {
    try {
        for (const item of items) {
            // Extract product ID from any of the possible fields
            const productId = item._id || item.id || item.productId;
            
            // Skip if no size or quantity specified
            if (!item.size || !item.quantity) {
                console.log("Skipping item - missing size or quantity:", item);
                continue;
            }
            
            // Find the product
            const product = await productModel.findById(productId);
            if (!product) {
                console.log("Product not found:", productId);
                continue;
            }
            
            // Convert Map to regular object if necessary
            const stockData = product.stock instanceof Map ? 
                Object.fromEntries(product.stock) : 
                product.stock;

            // Check if stock exists for this size
            if (stockData && typeof stockData[item.size] === 'number') {
                // Calculate new stock value (don't go below 0)
                const newStockValue = Math.max(0, stockData[item.size] - item.quantity);
                
                // Update product stock using $set operator
                const result = await productModel.findByIdAndUpdate(
                    productId,
                    { $set: { [`stock.${item.size}`]: newStockValue } },
                    { new: true }
                );
                
                // Fixed template literal syntax
                console.log(`Stock updated for product ${productId}, size ${item.size}: ${stockData[item.size]} -> ${newStockValue}`);
            } else {
                // Fixed template literal syntax
                console.log(`Invalid stock data for product ${productId}, size ${item.size}:`, stockData);
            }
        }
        return true;
    } catch (error) {
        console.error("Error updating stock:", error);
        return false;
    }
};

// Validate stock availability
// Modified validateStockAvailability function
const validateStockAvailability = async (items) => {
  try {
    if (!items || !Array.isArray(items)) {
      console.error("Invalid items format:", items);
      return { valid: false, message: "Invalid items format" };
    }

    for (const item of items) {
      const productId = item._id || item.id || item.productId;

      // Debug logging
      console.log("Validating stock for item:", {
        productId,
        size: item.size,
        quantity: item.quantity
      });

      const product = await productModel.findById(productId);
      if (!product) {
        console.error(`Product not found with ID: ${productId}`);
        return { valid: false, message: `Product not found: ${productId}` };
      }

      // Convert Map to regular object if necessary
      const stockData = product.stock instanceof Map ? 
        Object.fromEntries(product.stock) : 
        product.stock;

      // Debug logging
      console.log("Product stock information:", {
        productName: product.name,
        stock: stockData,
        requestedSize: item.size,
        availableStock: stockData?.[item.size]
      });

      // Check if stock object exists
      if (!stockData) {
        return {
          valid: false,
          message: `Stock information not available for ${product.name}`
        };
      }

      // Check if size exists in stock
      if (!(item.size in stockData)) {
        return {
          valid: false,
          message: `Size ${item.size} not available in stock for ${product.name}`
        };
      }

      // Check quantity
      if (stockData[item.size] < item.quantity) {
        return {
          valid: false,
          message: `Not enough stock available for ${product.name} in size ${item.size}. Available: ${stockData[item.size]}, Requested: ${item.quantity}`
        };
      }
    }
    return { valid: true };
  } catch (error) {
    console.error("Error validating stock:", error);
    return { valid: false, message: "Error validating stock: " + error.message };
  }
};

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, appliedRedemption, originalAmount, coinDiscounts, totalCoinsUsed } = req.body;

    // Validate that only one discount method is being used
    const hasRedemptionDiscount = appliedRedemption && appliedRedemption.discountAmount > 0;
    const hasCoinDiscounts = coinDiscounts && Object.keys(coinDiscounts).length > 0 && totalCoinsUsed > 0;

    if (hasRedemptionDiscount && hasCoinDiscounts) {
      return res.json({ 
        success: false, 
        message: "Cannot use both redemption codes and coin discounts in the same order. Please use only one discount method." 
      });
    }

    // Validate stock availability first
    const stockValidation = await validateStockAvailability(items);
    if (!stockValidation.valid) {
      return res.json({ success: false, message: stockValidation.message });
    }

    const orderData = {
      userId,
      items,
      amount, // This is already the discounted amount from frontend
      originalAmount: originalAmount || amount, // Store original amount for reference
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      appliedRedemption: appliedRedemption || null,
      coinDiscounts: coinDiscounts || {},
      totalCoinsUsed: totalCoinsUsed || 0
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // If redemption was applied, mark it as used
    if (appliedRedemption && appliedRedemption.redemptionId) {
      try {
        await applyRedemptionCode({
          body: {
            redemptionId: appliedRedemption.redemptionId,
            orderId: newOrder._id
          }
        }, {
          json: () => {} // Mock response object
        });
      } catch (redemptionError) {
        console.error('Error applying redemption code:', redemptionError);
        // Don't fail the order if redemption marking fails
      }
    }

    // Update product stock after order is saved
    await updateProductStock(items);

    // Award purchase coins based on final amount paid
    try {
      await awardPurchaseCoins(userId, amount, newOrder._id.toString());
    } catch (coinError) {
      console.error('Error awarding purchase coins:', coinError);
      // Don't fail the order if coin awarding fails
    }

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    const { amount, items, appliedRedemption, coinDiscounts, totalCoinsUsed } = req.body;

    // Validate that only one discount method is being used
    const hasRedemptionDiscount = appliedRedemption && appliedRedemption.discountAmount > 0;
    const hasCoinDiscounts = coinDiscounts && Object.keys(coinDiscounts).length > 0 && totalCoinsUsed > 0;

    if (hasRedemptionDiscount && hasCoinDiscounts) {
      return res.json({ 
        success: false, 
        message: "Cannot use both redemption codes and coin discounts in the same order. Please use only one discount method." 
      });
    }

    // Validate stock availability first
    if (items && items.length > 0) {
      const stockValidation = await validateStockAvailability(items);
      if (!stockValidation.valid) {
        return res.json({ success: false, message: stockValidation.message });
      }
    }

    const options = {
      amount: amount * 100, // Use the discounted amount from frontend
      currency: currency.toUpperCase(),
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.log("Razorpay order creation error:", err);
    res.json({ success: false, message: err.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
      userId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      // Validate that only one discount method is being used
      const hasRedemptionDiscount = orderData.appliedRedemption && orderData.appliedRedemption.discountAmount > 0;
      const hasCoinDiscounts = orderData.coinDiscounts && Object.keys(orderData.coinDiscounts).length > 0 && orderData.totalCoinsUsed > 0;

      if (hasRedemptionDiscount && hasCoinDiscounts) {
        return res.json({ 
          success: false, 
          message: "Cannot use both redemption codes and coin discounts in the same order. Please use only one discount method." 
        });
      }

      // Make sure userId is included in the order data
      const newOrder = new orderModel({
        userId,
        items: orderData.items,
        amount: orderData.amount, // This is already the discounted amount
        originalAmount: orderData.originalAmount || orderData.amount,
        address: orderData.address,
        paymentMethod: "razorpay",
        payment: true,
        date: Date.now(),
        appliedRedemption: orderData.appliedRedemption || null,
        coinDiscounts: orderData.coinDiscounts || {},
        totalCoinsUsed: orderData.totalCoinsUsed || 0
      });

      await newOrder.save();

      // If redemption was applied, mark it as used
      if (orderData.appliedRedemption && orderData.appliedRedemption.redemptionId) {
        try {
          await applyRedemptionCode({
            body: {
              redemptionId: orderData.appliedRedemption.redemptionId,
              orderId: newOrder._id
            }
          }, {
            json: () => {} // Mock response object
          });
        } catch (redemptionError) {
          console.error('Error applying redemption code:', redemptionError);
          // Don't fail the order if redemption marking fails
        }
      }

      // Update product stock after successful payment
      await updateProductStock(orderData.items);

      // Award MNAR Coins for purchase based on final amount paid
      try {
        await awardPurchaseCoins(userId, orderData.amount, newOrder._id);
      } catch (coinError) {
        console.error('Error awarding purchase coins:', coinError);
        // Don't fail the order if coin awarding fails
      }

      // Clear user's cart
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// All Orders Data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Orders Data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order Status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Add this function to your orderController.js file or update the existing one

const createOrder = async (req, res) => {
  try {
    // Extract userId from token if not provided in request
    const userId = req.body.userId || req.userId;
    const { items, amount, address } = req.body;

    console.log("Order Items:", JSON.stringify(items));

    // Map items to ensure correct ID format
    const formattedItems = items.map((item) => ({
      ...item,
      id: item._id || item.id || item.productId, // Ensure we have an ID property
      productId: item._id || item.id || item.productId, // Add both formats
      _id: item._id || item.id || item.productId, // Ensure _id is also present
    }));

    // Validate stock availability first
    const stockValidation = await validateStockAvailability(formattedItems);
    if (!stockValidation.valid) {
      return res.json({ success: false, message: stockValidation.message });
    }

    // Create the order object
    const orderData = {
      userId,
      items: formattedItems,
      amount,
      address,
      paymentMethod: "Online",
      payment: true,
      date: Date.now(),
      status: "Order Placed",
    };

    // Save the order to database
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();

    // Update product stock after order is saved
    await updateProductStock(formattedItems);

    // Award MNAR Coins for purchase
    if (userId) {
      await awardPurchaseCoins(userId, amount, savedOrder._id);
    }

    // Clear user's cart if userId is provided
    if (userId) {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    }

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Handle order cancellation with stock restoration
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Only allow cancellation for certain statuses
    const allowedStatuses = ["Order Placed", "Processing", "Confirmed"];
    if (!allowedStatuses.includes(order.status)) {
      return res.json({
        success: false,
        message: "Cannot cancel order in current status",
      });
    }

    // Restore product stock
    for (const item of order.items) {
      if (!item.size || !item.quantity) continue;

      // Find the product
      const product = await productModel.findById(item.id || item.productId);
      if (!product) continue;

      // Update stock by adding the quantity back
      if (product.stock && product.stock[item.size] !== undefined) {
        await productModel.findByIdAndUpdate(product._id, {
          $inc: { [`stock.${item.size}`]: item.quantity },
        });
      }
    }

    // Update order status to cancelled
    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  createOrder,
};
