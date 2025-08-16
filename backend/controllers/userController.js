import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { processReferralSignup, addCoinsToUser } from "./coinController.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "user Doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token: token });
    } else {
      res.json({ success: false, message: "invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "user already exists" });
    }
    // validating email format and Strong Password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Award signup bonus coins
    await addCoinsToUser(
      user._id,
      25, // 25 MNAR Coins signup bonus
      'EARN',
      'SIGNUP_BONUS',
      'Welcome to MNAR! Here are your welcome coins 🎉',
      { isNewUser: true }
    );

    // Process referral if referral code provided
    if (referralCode) {
      await processReferralSignup(referralCode, user._id);
    }

    const token = createToken(user._id);
    res.json({ success: true, token: token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success: true, token})
            
        }
        else {
            res.json({success: false, message: "Invalid Credentials"})
        }

    } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
    }


};

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.body.userId, 
      { name }, 
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clean up cart data for deleted products
const cleanupUserCarts = async (req, res) => {
  try {
    const productModel = await import("../models/productModel.js");
    
    // Get all existing product IDs
    const existingProducts = await productModel.default.find({}, '_id');
    const existingProductIds = existingProducts.map(p => p._id.toString());
    
    // Get all users with cart data
    const users = await userModel.find({ cartData: { $exists: true, $ne: {} } });
    
    let cleanedCount = 0;
    
    for (const user of users) {
      let cartUpdated = false;
      const cartData = user.cartData;
      
      // Check each product in user's cart
      for (const productId in cartData) {
        if (!existingProductIds.includes(productId)) {
          delete cartData[productId];
          cartUpdated = true;
          cleanedCount++;
        }
      }
      
      // Update user if cart was modified
      if (cartUpdated) {
        await userModel.findByIdAndUpdate(user._id, { cartData });
      }
    }
    
    res.json({ 
      success: true, 
      message: `Cleaned ${cleanedCount} invalid cart items from user carts` 
    });
  } catch (error) {
    console.log('Cart cleanup error:', error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, cleanupUserCarts };
