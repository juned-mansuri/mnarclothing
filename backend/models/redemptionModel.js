import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false // Allow null for admin-created codes
    },
    rewardType: {
        type: String,
        enum: ['DISCOUNT_10', 'DISCOUNT_30', 'DISCOUNT_50', 'DISCOUNT_100', 'DISCOUNT_200', 'DISCOUNT', 'COINS', 'FREE_ITEM', 'SPECIAL_ACCESS'],
        required: true
    },
    coinsRedeemed: {
        type: Number,
        required: false,
        default: 0
    },
    rewardCode: {
        type: String,
        required: true,
        unique: true
    },
    rewardData: {
        discountCode: String,
        discountAmount: Number,
        coinAmount: Number,
        accessCode: String,
        rewardCode: String,
        freeItemType: String,
        description: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'USED', 'EXPIRED', 'INACTIVE'],
        default: 'ACTIVE'
    },
    usedAt: {
        type: Date,
        default: null
    },
    usedInOrderId: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
        default: function() {
            // Set expiry to 30 days from now
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    },
    // New fields for admin management
    usageLimit: {
        type: Number,
        default: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isAdminCreated: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
        default: 'user'
    }
}, {
    timestamps: true
});

const redemptionModel = mongoose.models.redemption || mongoose.model('redemption', redemptionSchema);

export default redemptionModel;
