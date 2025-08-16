import express from 'express';
import {
    getCoinBalance,
    awardChallengeCoins,
    awardStoryTagCoins,
    generateReferralCode,
    redeemCoins,
    getAvailableRewards,
    adjustCoins,
    getUserRedemptions,
    validateRedemptionCode,
    applyRedemptionCode,
    checkRewardAccess,
    createCustomRedeemCode,
    getAllRedeemCodes,
    updateRedeemCodeStatus,
    deleteRedeemCode,
    getRedeemCodeAnalytics,
    redeemCoinCode,
    searchUsers,
    getUserTransactions
} from '../controllers/coinController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const coinRouter = express.Router();

// User routes (require authentication)
coinRouter.post('/balance', authUser, getCoinBalance);
coinRouter.post('/referral-code', authUser, generateReferralCode);
coinRouter.post('/redeem', authUser, redeemCoins);
coinRouter.post('/rewards', authUser, getAvailableRewards);
coinRouter.get('/redemptions', authUser, getUserRedemptions);
coinRouter.post('/redeem-coin-code', authUser, redeemCoinCode);

// Access checking routes
coinRouter.get('/check-access/:rewardType', authUser, checkRewardAccess);

// Checkout routes (public for validation, authenticated for application)
coinRouter.post('/validate-code', validateRedemptionCode);
coinRouter.post('/apply-code', authUser, applyRedemptionCode);

// Admin routes (require admin authentication)
coinRouter.post('/award-challenge', adminAuth, awardChallengeCoins);
coinRouter.post('/award-story-tag', adminAuth, awardStoryTagCoins);
coinRouter.post('/adjust', adminAuth, adjustCoins);

// Admin redeem code management routes
coinRouter.post('/admin/create-code', adminAuth, createCustomRedeemCode);
coinRouter.get('/admin/codes', adminAuth, getAllRedeemCodes);
coinRouter.put('/admin/update-code-status', adminAuth, updateRedeemCodeStatus);
coinRouter.delete('/admin/delete-code/:codeId', adminAuth, deleteRedeemCode);
coinRouter.get('/admin/analytics', adminAuth, getRedeemCodeAnalytics);

// Admin user management routes
coinRouter.get('/admin/search-users', adminAuth, searchUsers);
coinRouter.get('/admin/user-transactions/:userId', adminAuth, getUserTransactions);

export default coinRouter;
