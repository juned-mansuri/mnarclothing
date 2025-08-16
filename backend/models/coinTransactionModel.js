import mongoose from 'mongoose';

const coinTransactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['EARN', 'REDEEM'],
        required: true
    },
    action: {
        type: String,
        enum: [
            'CHALLENGE_WIN',
            'STORY_TAG',
            'REFERRAL',
            'PURCHASE',
            'SIGNUP_BONUS',
            'DISCOUNT_10_REDEEM',
            'DISCOUNT_30_REDEEM',
            'DISCOUNT_50_REDEEM',
            'DISCOUNT_100_REDEEM',
            'DISCOUNT_200_REDEEM',
            'COIN_CODE_REDEEM',
            'ADMIN_ADJUSTMENT'
        ],
        required: true
    },
    coins: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        default: null // For purchase-related transactions
    },
    referralCode: {
        type: String,
        default: null // For referral transactions
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
        default: 'COMPLETED'
    },
    metadata: {
        type: Object,
        default: {} // For storing additional data like discount codes, etc.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const coinTransactionModel = mongoose.models.coinTransaction || mongoose.model('coinTransaction', coinTransactionSchema);

export default coinTransactionModel;
