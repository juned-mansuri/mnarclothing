import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mnarCoins: {
        type: Number,
        default: 0
    },
    totalCoinsEarned: {
        type: Number,
        default: 0
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    cartData: {type: Object,default: {} }
} ,{minimize: false})


const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;