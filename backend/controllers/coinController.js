import userModel from '../models/userModel.js';
import coinTransactionModel from '../models/coinTransactionModel.js';
import referralModel from '../models/referralModel.js';
import orderModel from '../models/orderModel.js';
import redemptionModel from '../models/redemptionModel.js';
import mongoose from 'mongoose';

// Coin earning rules
const COIN_RULES = {
    CHALLENGE_WIN: 100,
    STORY_TAG: 10,
    REFERRAL: 50,
    PURCHASE_RATE: 1, // 1 coin per ₹10 spent
    SIGNUP_BONUS: 25
};

// Coin redemption rules - coin-based discount codes
const REDEMPTION_RULES = {
    DISCOUNT_10: { coins: 100, description: '₹10 discount code' },
    DISCOUNT_30: { coins: 300, description: '₹30 discount code' },
    DISCOUNT_50: { coins: 500, description: '₹50 discount code' },
    DISCOUNT_100: { coins: 1000, description: '₹100 discount code' },
    DISCOUNT_200: { coins: 2000, description: '₹200 discount code' }
};

// Helper function to add coins to user account
const addCoinsToUser = async (userId, coins, type, action, description, metadata = {}) => {
    try {
        // Update user's coin balance
        const user = await userModel.findByIdAndUpdate(
            userId,
            { 
                $inc: { 
                    mnarCoins: coins,
                    totalCoinsEarned: coins > 0 ? coins : 0
                }
            },
            { new: true }
        );

        // Create transaction record
        const transaction = new coinTransactionModel({
            userId,
            type,
            action,
            coins,
            description,
            metadata
        });

        await transaction.save();

        return { success: true, user, transaction };
    } catch (error) {
        console.error('Error adding coins:', error);
        return { success: false, message: error.message };
    }
};

// Get user's coin balance and transaction history
export const getCoinBalance = async (req, res) => {
    try {
        const userIdOrEmail = req.body.userId || req.body.email;
        let user;

        if (userIdOrEmail.includes('@')) {
            user = await userModel.findOne({ email: userIdOrEmail }).select('mnarCoins totalCoinsEarned');
        } else {
            user = await userModel.findById(userIdOrEmail).select('mnarCoins totalCoinsEarned');
        }

        const transactions = await coinTransactionModel.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            coinBalance: user.mnarCoins,
            totalCoinsEarned: user.totalCoinsEarned,
            transactions
        });
    } catch (error) {
        console.error('Error getting coin balance:', error);
        res.json({ success: false, message: error.message });
    }
};

// Award coins for challenge wins (Admin only)
export const awardChallengeCoins = async (req, res) => {
    try {
        const { userId, email, challengeDescription } = req.body;
        
        // Find user by email or userId
        let user;
        const userIdOrEmail = userId || email;
        
        if (userIdOrEmail.includes('@')) {
            user = await userModel.findOne({ email: userIdOrEmail });
        } else {
            user = await userModel.findById(userIdOrEmail);
        }
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const result = await addCoinsToUser(
            user._id,
            COIN_RULES.CHALLENGE_WIN,
            'EARN',
            'CHALLENGE_WIN',
            `Challenge Win: ${challengeDescription}`,
            { challengeDescription }
        );

        if (result.success) {
            res.json({
                success: true,
                message: `${COIN_RULES.CHALLENGE_WIN} MNAR Coins awarded for challenge win!`,
                newBalance: result.user.mnarCoins
            });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error awarding challenge coins:', error);
        res.json({ success: false, message: error.message });
    }
};

// Award coins for story tags (Admin only)
export const awardStoryTagCoins = async (req, res) => {
    try {
        const { userId, email, platform, storyUrl } = req.body;
        
        // Find user by email or userId
        let user;
        const userIdOrEmail = userId || email;
        
        if (userIdOrEmail.includes('@')) {
            user = await userModel.findOne({ email: userIdOrEmail });
        } else {
            user = await userModel.findById(userIdOrEmail);
        }
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const result = await addCoinsToUser(
            user._id,
            COIN_RULES.STORY_TAG,
            'EARN',
            'STORY_TAG',
            `Story Tag on ${platform}`,
            { platform, storyUrl }
        );

        if (result.success) {
            res.json({
                success: true,
                message: `${COIN_RULES.STORY_TAG} MNAR Coins awarded for story tag!`,
                newBalance: result.user.mnarCoins
            });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error awarding story tag coins:', error);
        res.json({ success: false, message: error.message });
    }
};

// Generate referral code for user
export const generateReferralCode = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        
        // Generate unique referral code using userId (more reliable)
        const referralCode = `MNAR${user.name.substring(0, 3).toUpperCase()}${userId.substring(-6)}`;
        
        // Store the referral code in user document for easier lookup
        await userModel.findByIdAndUpdate(userId, { 
            referralCode: referralCode 
        });
        
        // Determine frontend URL based on environment
        let frontendUrl;
        if (process.env.NODE_ENV === 'production') {
            // For production, use the production frontend URL
            frontendUrl = process.env.FRONTEND_URL || 'https://mnar.in';
        } else {
            // For development, use localhost
            frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        }
        
        res.json({
            success: true,
            referralCode,
            referralLink: `${frontendUrl}/login?ref=${referralCode}`
        });
    } catch (error) {
        console.error('Error generating referral code:', error);
        res.json({ success: false, message: error.message });
    }
};

// Process referral signup
export const processReferralSignup = async (referralCode, newUserId) => {
    try {
        // Find the referrer by their referral code
        const referrer = await userModel.findOne({ referralCode: referralCode });
        
        if (!referrer) {
            console.log('Referral code not found:', referralCode);
            return { success: false, message: 'Invalid referral code' };
        }

        // Prevent self-referral
        if (referrer._id.toString() === newUserId.toString()) {
            console.log('Self-referral attempt detected');
            return { success: false, message: 'Cannot refer yourself' };
        }

        // Award coins to referrer
        const referrerResult = await addCoinsToUser(
            referrer._id,
            COIN_RULES.REFERRAL,
            'EARN',
            'REFERRAL',
            'Friend referral bonus - Someone signed up with your code!',
            { referredUserId: newUserId, referralCode }
        );

        // Award signup bonus to new user (additional to the regular signup bonus)
        const newUserResult = await addCoinsToUser(
            newUserId,
            COIN_RULES.REFERRAL,
            'EARN',
            'REFERRAL_SIGNUP',
            'Referral signup bonus - Welcome to MNAR!',
            { referrerUserId: referrer._id, referralCode }
        );

        // Create referral record
        const referral = new referralModel({
            referrerId: referrer._id,
            refereeId: newUserId,
            referralCode,
            status: 'COMPLETED',
            coinsAwarded: COIN_RULES.REFERRAL,
            completedAt: new Date()
        });

        await referral.save();

        console.log(`Referral processed successfully: ${referralCode}`);
        console.log(`Referrer (${referrer.name}) awarded ${COIN_RULES.REFERRAL} coins`);
        console.log(`New user awarded ${COIN_RULES.REFERRAL} coins`);

        return { 
            success: true, 
            referrerCoins: COIN_RULES.REFERRAL,
            newUserCoins: COIN_RULES.REFERRAL
        };
    } catch (error) {
        console.error('Error processing referral:', error);
        return { success: false, message: error.message };
    }
};

// Award coins for purchases (called from order controller)
export const awardPurchaseCoins = async (userId, amount, orderId) => {
    try {
        const coinsToAward = Math.floor(amount / 10) * COIN_RULES.PURCHASE_RATE;
        
        if (coinsToAward > 0) {
            await addCoinsToUser(
                userId,
                coinsToAward,
                'EARN',
                'PURCHASE',
                `Purchase coins for order ₹${amount}`,
                { orderId, amount }
            );
        }

        return { success: true, coinsAwarded: coinsToAward };
    } catch (error) {
        console.error('Error awarding purchase coins:', error);
        return { success: false, message: error.message };
    }
};

// Redeem coins for rewards
export const redeemCoins = async (req, res) => {
    try {
        const { rewardType, customAmount, customDescription } = req.body;
        const userId = req.body.userId;

        let coinsToRedeem, description;

        // Handle predefined rewards
        if (rewardType && REDEMPTION_RULES[rewardType]) {
            coinsToRedeem = REDEMPTION_RULES[rewardType].coins;
            description = REDEMPTION_RULES[rewardType].description;
        } 
        // Handle custom redemption (admin only)
        else if (customAmount && customDescription) {
            coinsToRedeem = customAmount;
            description = customDescription;
        } else {
            return res.json({ success: false, message: 'Invalid redemption type' });
        }

        // Check if user has enough coins
        const user = await userModel.findById(userId);
        if (user.mnarCoins < coinsToRedeem) {
            return res.json({ 
                success: false, 
                message: `Insufficient coins. You have ${user.mnarCoins} coins but need ${coinsToRedeem}` 
            });
        }

        // Generate reward code and data FIRST (before deducting coins)
        let rewardData = {};
        let rewardCode = '';
        
        switch (rewardType) {
            case 'DISCOUNT_10':
                rewardCode = `MNAR10-${Date.now()}`;
                rewardData.discountCode = rewardCode;
                rewardData.discountAmount = 10;
                rewardData.description = 'Get ₹10 off on your next purchase';
                break;
            case 'DISCOUNT_30':
                rewardCode = `MNAR30-${Date.now()}`;
                rewardData.discountCode = rewardCode;
                rewardData.discountAmount = 30;
                rewardData.description = 'Get ₹30 off on your next purchase';
                break;
            case 'DISCOUNT_50':
                rewardCode = `MNAR50-${Date.now()}`;
                rewardData.discountCode = rewardCode;
                rewardData.discountAmount = 50;
                rewardData.description = 'Get ₹50 off on your next purchase';
                break;
            case 'DISCOUNT_100':
                rewardCode = `MNAR100-${Date.now()}`;
                rewardData.discountCode = rewardCode;
                rewardData.discountAmount = 100;
                rewardData.description = 'Get ₹100 off on your next purchase';
                break;
            case 'DISCOUNT_200':
                rewardCode = `MNAR200-${Date.now()}`;
                rewardData.discountCode = rewardCode;
                rewardData.discountAmount = 200;
                rewardData.description = 'Get ₹200 off on your next purchase';
                break;
            default:
                return res.json({ success: false, message: 'Invalid reward type' });
        }

        // Create and save redemption record FIRST (before deducting coins)
        const redemption = new redemptionModel({
            userId,
            rewardType,
            coinsRedeemed: coinsToRedeem, // Fixed: use coinsToRedeem instead of undefined coinsRedeemed
            rewardCode,
            rewardData,
            status: 'ACTIVE'
        });

        try {
            await redemption.save();
        } catch (redemptionError) {
            console.error('Error saving redemption:', redemptionError);
            return res.json({ success: false, message: 'Failed to create redemption record' });
        }

        // Map reward types to action enum values
        let actionValue;
        switch (rewardType) {
            case 'DISCOUNT_10':
                actionValue = 'DISCOUNT_10_REDEEM';
                break;
            case 'DISCOUNT_30':
                actionValue = 'DISCOUNT_30_REDEEM';
                break;
            case 'DISCOUNT_50':
                actionValue = 'DISCOUNT_50_REDEEM';
                break;
            case 'DISCOUNT_100':
                actionValue = 'DISCOUNT_100_REDEEM';
                break;
            case 'DISCOUNT_200':
                actionValue = 'DISCOUNT_200_REDEEM';
                break;
                break;
            default:
                actionValue = 'ADMIN_ADJUSTMENT';
        }

        // NOW deduct coins (only after redemption record is successfully saved)
        const result = await addCoinsToUser(
            userId,
            -coinsToRedeem,
            'REDEEM',
            actionValue,
            description,
            { rewardType, originalAmount: coinsToRedeem, redemptionId: redemption._id }
        );

        if (result.success) {
            res.json({
                success: true,
                message: `Successfully redeemed ${coinsToRedeem} coins for ${description}`,
                newBalance: result.user.mnarCoins,
                redemption: {
                    code: rewardCode,
                    type: rewardType,
                    description: rewardData.description,
                    expiresAt: redemption.expiresAt
                }
            });
        } else {
            // If coin deduction fails, we need to remove the redemption record
            await redemptionModel.findByIdAndDelete(redemption._id);
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error redeeming coins:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get available rewards
export const getAvailableRewards = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        
        const rewards = Object.keys(REDEMPTION_RULES).map(key => ({
            type: key,
            ...REDEMPTION_RULES[key],
            canAfford: user.mnarCoins >= REDEMPTION_RULES[key].coins
        }));

        res.json({
            success: true,
            userCoins: user.mnarCoins,
            rewards
        });
    } catch (error) {
        console.error('Error getting available rewards:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin function to manually adjust coins
export const adjustCoins = async (req, res) => {
    try {
        const { userId, email, coins, reason } = req.body;
        
        // Find user by email or userId
        let user;
        const userIdOrEmail = userId || email;
        
        if (userIdOrEmail.includes('@')) {
            user = await userModel.findOne({ email: userIdOrEmail });
        } else {
            user = await userModel.findById(userIdOrEmail);
        }
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const result = await addCoinsToUser(
            user._id,
            coins,
            coins > 0 ? 'EARN' : 'REDEEM',
            'ADMIN_ADJUSTMENT',
            reason || 'Admin adjustment',
            { adminUserId: req.body.adminId, reason }
        );

        if (result.success) {
            res.json({
                success: true,
                message: `Successfully ${coins > 0 ? 'added' : 'deducted'} ${Math.abs(coins)} coins`,
                newBalance: result.user.mnarCoins
            });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error adjusting coins:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get user's redemptions and referral data
export const getUserRedemptions = async (req, res) => {
    try {
        const userId = req.body.userId;
        
        // Get redemptions
        const redemptions = await redemptionModel.find({ userId })
            .sort({ createdAt: -1 });

        // Get user's referral code
        const user = await userModel.findById(userId).select('referralCode name');
        
        // Get referral statistics
        const referralStats = await referralModel.aggregate([
            { $match: { referrerId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'refereeId',
                    foreignField: '_id',
                    as: 'referredUser'
                }
            },
            {
                $project: {
                    referralCode: 1,
                    status: 1,
                    coinsAwarded: 1,
                    completedAt: 1,
                    referredUserName: { $arrayElemAt: ['$referredUser.name', 0] },
                    referredUserEmail: { $arrayElemAt: ['$referredUser.email', 0] }
                }
            },
            { $sort: { completedAt: -1 } }
        ]);

        const totalReferrals = referralStats.length;
        const totalReferralCoins = referralStats.reduce((sum, ref) => sum + (ref.coinsAwarded || 0), 0);

        res.json({
            success: true,
            redemptions,
            referralData: {
                userReferralCode: user.referralCode,
                totalReferrals,
                totalReferralCoins,
                referralHistory: referralStats,
                coinsPerReferral: COIN_RULES.REFERRAL
            }
        });
    } catch (error) {
        console.error('Error getting user redemptions:', error);
        res.json({ success: false, message: error.message });
    }
};

// Validate redemption code at checkout
export const validateRedemptionCode = async (req, res) => {
    try {
        const { rewardCode, cartTotal, hasActiveCoinDiscounts } = req.body;
        
        // Check if coin discounts are active
        if (hasActiveCoinDiscounts) {
            return res.json({ 
                success: false, 
                message: 'Cannot apply discount code when coin discounts are active. Please remove coin discounts first.' 
            });
        }
        
        const redemption = await redemptionModel.findOne({ 
            rewardCode, 
            status: 'ACTIVE',
            expiresAt: { $gt: new Date() }
        });

        if (!redemption) {
            return res.json({ 
                success: false, 
                message: 'Invalid or expired redemption code' 
            });
        }

        // Check usage limits for multi-use codes
        if (redemption.usageLimit > 1) {
            const currentUsed = redemption.usedCount || 0;
            if (currentUsed >= redemption.usageLimit) {
                return res.json({ 
                    success: false, 
                    message: 'This redemption code has reached its usage limit' 
                });
            }
        }

        let discountAmount = 0;
        let applicableDiscount = 0;
        let freeItem = null;
        let isValid = true;
        let message = '';

        switch (redemption.rewardType) {
            case 'DISCOUNT_10':
                discountAmount = 10;
                applicableDiscount = Math.min(discountAmount, cartTotal);
                message = `₹${applicableDiscount} discount applied`;
                break;
            case 'DISCOUNT_30':
                discountAmount = 30;
                applicableDiscount = Math.min(discountAmount, cartTotal);
                message = `₹${applicableDiscount} discount applied`;
                break;
            case 'DISCOUNT_50':
                discountAmount = 50;
                applicableDiscount = Math.min(discountAmount, cartTotal);
                message = `₹${applicableDiscount} discount applied`;
                break;
            case 'DISCOUNT_100':
                discountAmount = 100;
                applicableDiscount = Math.min(discountAmount, cartTotal);
                message = `₹${applicableDiscount} discount applied`;
                break;
            case 'DISCOUNT_200':
                discountAmount = 200;
                applicableDiscount = Math.min(discountAmount, cartTotal);
                message = `₹${applicableDiscount} discount applied`;
                break;
                
            // New admin-created reward types
            case 'DISCOUNT':
                discountAmount = redemption.rewardData?.discountAmount || 0;
                applicableDiscount = Math.min(discountAmount, cartTotal);
                message = `₹${applicableDiscount} discount applied`;
                break;
                
            case 'COINS':
                // For coin redemption codes, we don't apply discount but will add coins to user account
                message = `${redemption.rewardData?.coinAmount || 0} MNAR coins will be added to your account`;
                break;
                
            case 'FREE_ITEM':
                freeItem = {
                    type: redemption.rewardData?.freeItemType || 'FREE_TEE',
                    description: redemption.rewardData?.description || 'Free item',
                    value: 0
                };
                message = redemption.rewardData?.description || 'Free item added to your order';
                break;
                
            case 'SPECIAL_ACCESS':
                message = redemption.rewardData?.description || 'Special access activated';
                break;
                
            default:
                isValid = false;
                message = 'Invalid redemption type';
        }

        if (isValid) {
            res.json({
                success: true,
                message,
                redemption: {
                    code: rewardCode,
                    type: redemption.rewardType,
                    discountAmount: applicableDiscount,
                    freeItem,
                    redemptionId: redemption._id
                }
            });
        } else {
            res.json({ success: false, message });
        }
    } catch (error) {
        console.error('Error validating redemption code:', error);
        res.json({ success: false, message: error.message });
    }
};

// Apply redemption code (mark as used)
export const applyRedemptionCode = async (req, res) => {
    try {
        const { redemptionId, orderId } = req.body;
        
        // First, get the current redemption to check usage limits
        const currentRedemption = await redemptionModel.findById(redemptionId);
        
        if (!currentRedemption) {
            if (res && res.json) {
                return res.json({ 
                    success: false, 
                    message: 'Redemption not found' 
                });
            }
            return { success: false, message: 'Redemption not found' };
        }

        // Check if this is a multi-use code and increment usage count
        let updateData = {};
        if (currentRedemption.usageLimit > 1) {
            const newUsedCount = (currentRedemption.usedCount || 0) + 1;
            
            if (newUsedCount >= currentRedemption.usageLimit) {
                // Mark as used if usage limit reached
                updateData = {
                    status: 'USED',
                    usedAt: new Date(),
                    usedInOrderId: orderId,
                    usedCount: newUsedCount
                };
            } else {
                // Just increment usage count, keep active
                updateData = {
                    usedCount: newUsedCount,
                    usedInOrderId: orderId
                };
            }
        } else {
            // Single-use code, mark as used
            updateData = {
                status: 'USED',
                usedAt: new Date(),
                usedInOrderId: orderId,
                usedCount: 1
            };
        }

        const redemption = await redemptionModel.findByIdAndUpdate(
            redemptionId,
            updateData,
            { new: true }
        );

        if (res && res.json) {
            res.json({
                success: true,
                message: 'Redemption code applied successfully',
                redemption
            });
        }
        
        return { success: true, redemption };
    } catch (error) {
        console.error('Error applying redemption code:', error);
        if (res && res.json) {
            res.json({ success: false, message: error.message });
        }
        return { success: false, message: error.message };
    }
};

// Check if user has access to specific reward type
const checkRewardAccess = async (req, res) => {
    try {
        const { rewardType } = req.params;
        const userId = req.body.userId;

        // Find active redemption for this reward type
        const activeRedemption = await redemptionModel.findOne({
            userId,
            rewardType,
            status: 'ACTIVE',
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (activeRedemption) {
            res.json({
                success: true,
                hasAccess: true,
                expiryDate: activeRedemption.expiresAt,
                redemption: activeRedemption
            });
        } else {
            res.json({
                success: true,
                hasAccess: false,
                message: 'No active access found for this reward type'
            });
        }
    } catch (error) {
        console.error('Error checking reward access:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Create custom redeem code
export const createCustomRedeemCode = async (req, res) => {
    try {
        const { 
            rewardType, 
            customCode, 
            description, 
            discountAmount, 
            freeItemType, 
            usageLimit, 
            expiryDays,
            isActive = true
        } = req.body;

        // Validate required fields
        if (!rewardType || !description) {
            return res.json({ success: false, message: 'Reward type and description are required' });
        }

        // Generate code if not provided
        const rewardCode = customCode || `ADMIN-${rewardType}-${Date.now()}`;

        // Check if custom code already exists
        if (customCode) {
            const existingCode = await redemptionModel.findOne({ rewardCode: customCode });
            if (existingCode) {
                return res.json({ success: false, message: 'This code already exists' });
            }
        }

        // Set expiry date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (expiryDays || 30));

        // Create reward data based on type
        let rewardData = {};
        switch (rewardType) {
            case 'DISCOUNT':
                if (!discountAmount || discountAmount <= 0) {
                    return res.json({ success: false, message: 'Valid discount amount is required' });
                }
                rewardData = {
                    discountCode: rewardCode,
                    discountAmount: discountAmount,
                    description: description
                };
                break;
            case 'COINS':
                const { coinAmount } = req.body;
                if (!coinAmount || coinAmount <= 0) {
                    return res.json({ success: false, message: 'Valid coin amount is required' });
                }
                rewardData = {
                    rewardCode: rewardCode,
                    coinAmount: coinAmount,
                    description: description
                };
                break;
            case 'FREE_ITEM':
                rewardData = {
                    rewardCode: rewardCode,
                    freeItemType: freeItemType || 'FREE_TEE',
                    description: description
                };
                break;
            case 'SPECIAL_ACCESS':
                rewardData = {
                    accessCode: rewardCode,
                    description: description
                };
                break;
            default:
                return res.json({ success: false, message: 'Invalid reward type' });
        }

        // Create redemption record
        const redemption = new redemptionModel({
            userId: null, // Admin-created codes don't have initial user
            rewardType: rewardType,
            coinsRedeemed: 0, // Admin codes don't cost coins
            rewardCode: rewardCode,
            rewardData: rewardData,
            status: isActive ? 'ACTIVE' : 'INACTIVE',
            expiresAt: expiresAt,
            usageLimit: usageLimit || 1,
            usedCount: 0,
            isAdminCreated: true,
            createdBy: 'admin'
        });

        await redemption.save();

        res.json({
            success: true,
            message: 'Custom redeem code created successfully',
            redemption: {
                code: rewardCode,
                type: rewardType,
                description: description,
                expiresAt: expiresAt,
                usageLimit: usageLimit || 1
            }
        });
    } catch (error) {
        console.error('Error creating custom redeem code:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Get all redeem codes
export const getAllRedeemCodes = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        let filter = {};
        if (status && status !== 'all') {
            filter.status = status.toUpperCase();
        }

        const skip = (page - 1) * limit;
        
        const redemptions = await redemptionModel.find(filter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await redemptionModel.countDocuments(filter);

        // Add usage statistics
        const redeemCodesWithStats = redemptions.map(redemption => ({
            _id: redemption._id,
            rewardCode: redemption.rewardCode,
            rewardType: redemption.rewardType,
            description: redemption.rewardData?.description || '',
            status: redemption.status,
            usageLimit: redemption.usageLimit || 1,
            usedCount: redemption.usedCount || 0,
            remainingUses: (redemption.usageLimit || 1) - (redemption.usedCount || 0),
            expiresAt: redemption.expiresAt,
            createdAt: redemption.createdAt,
            usedAt: redemption.usedAt,
            isAdminCreated: redemption.isAdminCreated || false,
            user: redemption.userId ? {
                name: redemption.userId.name,
                email: redemption.userId.email
            } : null,
            rewardData: redemption.rewardData
        }));

        res.json({
            success: true,
            redemptions: redeemCodesWithStats,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error('Error getting redeem codes:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Update redeem code status
export const updateRedeemCodeStatus = async (req, res) => {
    try {
        const { codeId, status } = req.body;
        
        if (!['ACTIVE', 'INACTIVE', 'USED', 'EXPIRED'].includes(status)) {
            return res.json({ success: false, message: 'Invalid status' });
        }

        const redemption = await redemptionModel.findByIdAndUpdate(
            codeId,
            { status: status },
            { new: true }
        );

        if (!redemption) {
            return res.json({ success: false, message: 'Redeem code not found' });
        }

        res.json({
            success: true,
            message: `Redeem code status updated to ${status}`,
            redemption
        });
    } catch (error) {
        console.error('Error updating redeem code status:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Delete redeem code
export const deleteRedeemCode = async (req, res) => {
    try {
        const { codeId } = req.params;
        
        const redemption = await redemptionModel.findByIdAndDelete(codeId);
        
        if (!redemption) {
            return res.json({ success: false, message: 'Redeem code not found' });
        }

        res.json({
            success: true,
            message: 'Redeem code deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting redeem code:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Get redeem code analytics
export const getRedeemCodeAnalytics = async (req, res) => {
    try {
        const totalCodes = await redemptionModel.countDocuments();
        const activeCodes = await redemptionModel.countDocuments({ status: 'ACTIVE' });
        const usedCodes = await redemptionModel.countDocuments({ status: 'USED' });
        const expiredCodes = await redemptionModel.countDocuments({ status: 'EXPIRED' });
        const adminCreatedCodes = await redemptionModel.countDocuments({ isAdminCreated: true });

        // Get usage by reward type
        const rewardTypeStats = await redemptionModel.aggregate([
            { $group: { _id: '$rewardType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentActivity = await redemptionModel.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const recentUsage = await redemptionModel.countDocuments({
            usedAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            success: true,
            analytics: {
                overview: {
                    totalCodes,
                    activeCodes,
                    usedCodes,
                    expiredCodes,
                    adminCreatedCodes
                },
                rewardTypeStats,
                recentActivity: {
                    codesCreated: recentActivity,
                    codesUsed: recentUsage
                }
            }
        });
    } catch (error) {
        console.error('Error getting redeem code analytics:', error);
        res.json({ success: false, message: error.message });
    }
};

// Redeem coin code directly (not during checkout)
const redeemCoinCode = async (req, res) => {
    try {
        const { rewardCode } = req.body;
        const userId = req.body.userId;

        if (!rewardCode) {
            return res.json({ success: false, message: 'Reward code is required' });
        }

        // Find the redemption code
        const redemption = await redemptionModel.findOne({
            rewardCode: rewardCode.toUpperCase(),
            status: 'ACTIVE'
        });

        if (!redemption) {
            return res.json({ success: false, message: 'Invalid or expired redemption code' });
        }

        // Check if code has expired
        if (new Date() > redemption.expiresAt) {
            await redemptionModel.findByIdAndUpdate(redemption._id, { status: 'EXPIRED' });
            return res.json({ success: false, message: 'This redemption code has expired' });
        }

        // Check usage limit
        if (redemption.usedCount >= redemption.usageLimit) {
            return res.json({ success: false, message: 'This redemption code has reached its usage limit' });
        }

        // Only allow COINS type for this endpoint
        if (redemption.rewardType !== 'COINS') {
            return res.json({ success: false, message: 'This code is not for coin redemption. Use it during checkout instead.' });
        }

        const coinAmount = redemption.rewardData?.coinAmount || 0;
        if (coinAmount <= 0) {
            return res.json({ success: false, message: 'Invalid coin amount in redemption code' });
        }

        // Add coins to user account
        await addCoinsToUser(userId, coinAmount, 'EARN', 'COIN_CODE_REDEEM', `Redeemed coin code: ${rewardCode}`, {
            redemptionId: redemption._id,
            rewardCode: rewardCode
        });

        // Update redemption usage
        await redemptionModel.findByIdAndUpdate(redemption._id, {
            $inc: { usedCount: 1 },
            $set: { 
                status: redemption.usedCount + 1 >= redemption.usageLimit ? 'USED' : 'ACTIVE',
                usedAt: new Date(),
                usedBy: userId
            }
        });

        res.json({
            success: true,
            message: `Successfully redeemed! ${coinAmount} MNAR coins have been added to your account.`,
            coinsAdded: coinAmount,
            redemption: {
                code: rewardCode,
                type: redemption.rewardType,
                description: redemption.rewardData?.description,
                coinAmount: coinAmount
            }
        });
    } catch (error) {
        console.error('Error redeeming coin code:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Search users
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim() === '') {
            return res.json({ success: false, message: 'Search query is required' });
        }

        const searchRegex = new RegExp(query, 'i');
        
        const users = await userModel.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : null }
            ]
        }).select('_id name email mnarCoins totalCoinsEarned createdAt').limit(20);

        res.json({ 
            success: true, 
            users: users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                coins: user.mnarCoins || 0,
                totalEarned: user.totalCoinsEarned || 0,
                totalRedeemed: 0, // Calculate this from transactions if needed
                joinDate: user.createdAt
            }))
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.json({ success: false, message: 'Error searching users' });
    }
};

// Admin: Get user transaction history
const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' });
        }

        // Verify user exists
        const user = await userModel.findById(userId).select('name email mnarCoins totalCoinsEarned');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const skip = (page - 1) * limit;
        
        const transactions = await coinTransactionModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const totalTransactions = await coinTransactionModel.countDocuments({ userId });

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                coins: user.mnarCoins || 0,
                totalEarned: user.totalCoinsEarned || 0,
                totalRedeemed: 0 // Calculate from transactions if needed
            },
            transactions: transactions.map(transaction => ({
                _id: transaction._id,
                type: transaction.type,
                amount: transaction.coins,
                description: transaction.description,
                orderId: transaction.orderId,
                redemptionId: transaction.redemptionId,
                createdAt: transaction.createdAt
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalTransactions / limit),
                totalTransactions,
                hasNext: skip + parseInt(limit) < totalTransactions,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error getting user transactions:', error);
        res.json({ success: false, message: 'Error fetching user transactions' });
    }
};

export { addCoinsToUser, COIN_RULES, REDEMPTION_RULES, checkRewardAccess, redeemCoinCode, searchUsers, getUserTransactions };
