import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
    referrerId: {
        type: String,
        required: true
    },
    refereeId: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
    },
    coinsAwarded: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
});

const referralModel = mongoose.models.referral || mongoose.model('referral', referralSchema);

export default referralModel;
