import express from 'express';
import {placeOrder, placeOrderRazorpay,allOrders,userOrders,updateStatus,createOrder,cancelOrder} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';


const orderRouter = express.Router();


// Admin Features
orderRouter.post('/list' ,adminAuth,allOrders)
orderRouter.post('/status' ,adminAuth,updateStatus)

// payment Features

orderRouter.post('/place', authUser ,placeOrder)
// orderRouter.post('/stripe', authUser ,placeOrderStripe)
orderRouter.post('/razorpay', authUser ,placeOrderRazorpay)

// User Features
orderRouter.post('/userorders',authUser,userOrders)


//verify payment
// orderRouter.post('/verifyStripe',authUser,verifyStripe)
// orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
// In your orderRoutes.js
orderRouter.post("/create", createOrder);
orderRouter.post("/cancel", cancelOrder);


export default orderRouter



