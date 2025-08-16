import express from 'express';
import { loginUser,registerUser,adminLogin, cleanupUserCarts, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.post('/admin' , adminLogin)
userRouter.get('/profile', authUser, getUserProfile)
userRouter.put('/update', authUser, updateUserProfile)
userRouter.post('/cleanup-carts', adminAuth, cleanupUserCarts)


export default userRouter;
