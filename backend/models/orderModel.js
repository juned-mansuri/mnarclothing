import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    userId :{type : String , required : true},
    items :{type : Array , required : true},
    amount :{type : Number , required : true}, // Final amount paid (after discounts)
    originalAmount :{type : Number , default : null}, // Original amount before discounts
    address :{type : Object , required : true},
    status :{type : String , required : true , default : 'Order Placed'} ,
    paymentMethod :{type : String , required : true},
    payment :{type : Boolean , required : true , default : false}, 
    date :{type : Number , required : true},
    appliedRedemption: {
        type: Object,
        default: null,
        // Structure: { code, type, discountAmount, freeItem, redemptionId }
    },
    coinDiscounts: {
        type: Object,
        default: {},
        // Structure: { "itemId_size": { coinsUsed, discountAmount, originalPrice, discountedPrice } }
    },
    totalCoinsUsed: {
        type: Number,
        default: 0
    }
});


const orderModel = mongoose.models.order || mongoose.model('order',orderSchema);

export default orderModel;