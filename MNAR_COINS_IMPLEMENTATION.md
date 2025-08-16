# MNAR Coins System Implementation

## 🎉 What We've Built

A comprehensive reward system for your MNAR clothing website that gamifies user engagement and boosts loyalty!

## 🏗️ Backend Implementation

### 1. Database Models
- **User Model**: Extended with `mnarCoins` and `totalCoinsEarned` fields
- **Coin Transaction Model**: Tracks all coin earnings and redemptions
- **Referral Model**: Manages friend referrals

### 2. Coin Controller (`/backend/controllers/coinController.js`)
**Earning Rules:**
- Challenge Win: 100 coins
- Story Tag: 10 coins  
- Friend Referral: 50 coins
- Purchase: 1 coin per ₹10 spent
- Signup Bonus: 25 coins

**Redemption Rules:**
- Free T-shirt: 300 coins
- ₹200 Discount: 200 coins
- Limited Edition Tee: 500 coins
- Early Access: 150 coins

### 3. API Endpoints (`/backend/routes/coinRoute.js`)
**User Endpoints:**
- `POST /api/coins/balance` - Get coin balance & transaction history
- `POST /api/coins/referral-code` - Generate referral code
- `POST /api/coins/redeem` - Redeem coins for rewards
- `POST /api/coins/rewards` - Get available rewards

**Admin Endpoints:**
- `POST /api/coins/award-challenge` - Award coins for challenge wins
- `POST /api/coins/award-story-tag` - Award coins for story tags
- `POST /api/coins/adjust` - Manual coin adjustments

### 4. Automatic Features
- **Purchase Coins**: Automatically awarded on successful orders
- **Referral System**: Works with signup process
- **Signup Bonus**: 25 coins for new users

## 🎨 Frontend Implementation

### 1. Coins Page (`/frontend/src/pages/Coins.jsx`)
Beautiful tabbed interface with:
- **Balance Tab**: Overview of user's coins
- **Earn Tab**: Ways to earn coins + referral system
- **Redeem Tab**: Available rewards to redeem
- **History Tab**: Transaction history

### 2. Navigation Integration
- **Coin Balance Display**: Shows current balance in navbar
- **Coins Link**: Added to user dropdown menu

### 3. Context Integration
Extended `ShopContext` with coin-related functions:
- `getCoinBalance()`, `generateReferralCode()`, `redeemCoins()`, etc.

### 4. Referral System
- **URL Parameter Support**: `/register?ref=MNARXYZ1234`
- **Auto-populate referral code**: When users click referral links
- **Bonus notifications**: Users see they'll earn coins

## ⚙️ Admin Panel

### 1. Coins Manager (`/admin/src/pages/CoinsManager.jsx`)
Admin interface to:
- Award coins for challenges (100 coins)
- Award coins for story tags (10 coins)  
- Manual coin adjustments (any amount)
- View earning/redemption rules

### 2. Navigation
Added "MNAR Coins" option to admin sidebar

## 🚀 How to Use

### For Users:
1. **Earn Coins**: 
   - Win YouTube/Instagram challenges
   - Tag @mnar.clothing in stories
   - Refer friends using your referral code
   - Make purchases (automatic)

2. **Redeem Coins**:
   - Visit `/coins` page
   - Choose from available rewards
   - Get discount codes or free items

3. **Track Progress**:
   - See balance in navbar
   - View transaction history
   - Check available rewards

### For Admins:
1. **Award Challenge Coins**:
   - Go to admin `/coins` page
   - Enter user ID/email
   - Select "Challenge Win"
   - Add description

2. **Award Story Tag Coins**:
   - Select "Story Tag" action
   - Add story URL/description

3. **Manual Adjustments**:
   - Select "Manual Adjustment"
   - Enter positive/negative amount
   - Provide reason

## 🔥 Key Features

✅ **Gamified Experience**: Users love earning and spending coins
✅ **Viral Marketing**: Referral system encourages sharing
✅ **Purchase Incentive**: Coins earned on every purchase
✅ **Admin Control**: Easy management of rewards
✅ **Transaction History**: Full audit trail
✅ **Mobile Friendly**: Responsive design
✅ **Real-time Updates**: Balance updates immediately

## 📱 User Journey

1. **Signup**: Get 25 welcome coins
2. **Make Purchase**: Earn 1 coin per ₹10 
3. **Win Challenge**: Admin awards 100 coins
4. **Tag Story**: Admin awards 10 coins
5. **Refer Friend**: Earn 50 coins when friend signs up
6. **Redeem Rewards**: Use coins for discounts/free items

## 🛠️ Installation & Setup

1. **Backend**: All routes added to `server.js`
2. **Frontend**: Coins page added to routing
3. **Admin**: CoinsManager added to admin panel
4. **Database**: Models will auto-create on first use

## 🎯 Marketing Benefits

- **Increased Engagement**: Users return to earn more coins
- **Organic Growth**: Referral system drives new users  
- **Higher Purchase Value**: Users want to earn more coins
- **Community Building**: Challenges create excitement
- **Brand Loyalty**: Gamification increases retention

## 🔮 Future Enhancements

- **Leaderboards**: Top coin earners
- **Seasonal Challenges**: Special events
- **Coin Expiry**: Create urgency
- **Tiered Rewards**: Different levels of benefits
- **Push Notifications**: Remind users about earning opportunities

Your MNAR Coins system is now ready to boost engagement and create a loyal community! 🚀🪙
