import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Coins = () => {
    const navigate = useNavigate();
    const {
        coinBalance,
        totalCoinsEarned,
        coinTransactions,
        getCoinBalance,
        generateReferralCode,
        redeemCoins,
        getAvailableRewards,
        backendUrl,
        token
    } = useContext(ShopContext);

    const [availableRewards, setAvailableRewards] = useState([]);
    const [referralData, setReferralData] = useState(null);
    const [activeTab, setActiveTab] = useState('balance');
    const [isLoading, setIsLoading] = useState(false);
    const [redeemingReward, setRedeemingReward] = useState(null); // Track which reward is being redeemed
    const [couponCode, setCouponCode] = useState('');
    const [redeemingCoupon, setRedeemingCoupon] = useState(false);

    useEffect(() => {
        if (token) {
            loadRewards();
        }
    }, [token]);

    const loadRewards = async () => {
        const rewards = await getAvailableRewards();
        if (rewards) {
            setAvailableRewards(rewards.rewards);
        }
    };

    const handleGenerateReferral = async () => {
        setIsLoading(true);
        const data = await generateReferralCode();
        if (data) {
            setReferralData(data);
        }
        setIsLoading(false);
    };

    const handleRedeemReward = async (rewardType) => {
        setRedeemingReward(rewardType);
        const result = await redeemCoins(rewardType);
        setRedeemingReward(null);
        
        if (result && result.success) {
            await loadRewards(); // Refresh rewards to update affordability
            
            // Add reward code to the existing success message
            if (result.rewardData) {
                const rewardCode = result.rewardData.discountCode || result.rewardData.rewardCode || result.rewardData.accessCode;
                if (rewardCode) {
                    toast.info(`Your reward code: ${rewardCode}`, { autoClose: 5000 });
                }
            }
            
            // Show success message with manual navigation option
            toast.success(
                <div>
                    <p>🎉 Redemption successful!</p>
                    <button 
                        onClick={() => navigate('/my-redemptions')}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                        View My Redemptions
                    </button>
                </div>,
                { autoClose: 8000, closeOnClick: false }
            );
            
            // Also try automatic navigation as backup
            setTimeout(() => {
                console.log('Auto-navigating to /my-redemptions');
                navigate('/my-redemptions');
            }, 3000);
        }
    };

    const handleRedeemCouponCode = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setRedeemingCoupon(true);
        
        try {
            const response = await axios.post(`${backendUrl}/api/coins/redeem-coin-code`, {
                rewardCode: couponCode.trim(),
                userId: token
            }, {
                headers: {
                    'token': token
                }
            });

            const data = response.data;

            if (data.success) {
                toast.success(data.message);
                setCouponCode('');
                // Refresh coin balance
                await getCoinBalance();
            } else {
                toast.error(data.message || 'Failed to redeem coupon code');
            }
        } catch (error) {
            console.error('Error redeeming coupon code:', error);
            toast.error('Failed to redeem coupon code');
        } finally {
            setRedeemingCoupon(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!token) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🪙</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">MNAR Coins</h2>
                    <p className="text-gray-600 mb-8">Please login to view your coin balance and earn rewards!</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Login to Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl">🪙</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">MNAR Coins</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-base px-2">Earn coins, unlock rewards, and get exclusive MNAR benefits!</p>
                <div className="mt-3 sm:mt-4">
                    <a 
                        href="/my-redemptions" 
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                        <span>🎁</span>
                        View My Redemptions
                    </a>
                </div>
            </div>

            {/* Coin Balance Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 sm:p-6 text-white mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base sm:text-lg font-medium opacity-90">Your Balance</h2>
                        <div className="text-3xl sm:text-4xl font-bold">{coinBalance} <span className="text-xl sm:text-2xl">Coins</span></div>
                        <p className="text-xs sm:text-sm opacity-90 mt-1">Total earned: {totalCoinsEarned} coins</p>
                    </div>
                    <div className="text-4xl sm:text-6xl opacity-50">🪙</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
                {[
                    { id: 'balance', label: 'Balance', icon: '💰' },
                    { id: 'earn', label: 'Earn Coins', icon: '⭐' },
                    { id: 'redeem', label: 'Redeem', icon: '🎁' },
                    { id: 'history', label: 'History', icon: '📋' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                            activeTab === tab.id 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span className="text-sm sm:text-base">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'balance' && (
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="bg-white rounded-lg border p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <span>📊</span> Balance Overview
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm sm:text-base">Current Balance:</span>
                                <span className="font-semibold text-sm sm:text-base">{coinBalance} coins</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm sm:text-base">Total Earned:</span>
                                <span className="font-semibold text-sm sm:text-base">{totalCoinsEarned} coins</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm sm:text-base">Total Redeemed:</span>
                                <span className="font-semibold text-sm sm:text-base">{totalCoinsEarned - coinBalance} coins</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <span>🎯</span> Quick Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-xs sm:text-sm text-green-600">Can afford {availableRewards.filter(r => r.canAfford).length} rewards</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs sm:text-sm text-blue-600">
                                    {coinBalance >= 100 ? "🎉 You can get discount codes!" : `Need ${100 - coinBalance} more coins for discount codes`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'earn' && (
                <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-lg border p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <span>🚀</span> Ways to Earn MNAR Coins
                        </h3>
                        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                            {[
                                { action: 'Win YouTube/Instagram Challenges', coins: 100, icon: '🏆' },
                                { action: 'Tag @mnar.clothing in stories', coins: 10, icon: '📸' },
                                { action: 'Refer a friend', coins: 50, icon: '👥' },
                                { action: 'Purchase (₹1 = 10 coin) ', coins: '10/₹1', icon: '🛒' },
                                { action: 'Sign up bonus', coins: 25, icon: '🎉' }
                            ].map((item, index) => (
                                <div key={index} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
                                            <span className="font-medium text-sm sm:text-base truncate">{item.action}</span>
                                        </div>
                                        <span className="text-yellow-600 font-bold text-sm sm:text-base flex-shrink-0 ml-2">+{item.coins}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <span>🔗</span> Refer Friends
                        </h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Share your referral link and earn 50 coins for each friend who signs up!</p>
                        {referralData ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Referral Code:</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            value={referralData.referralCode} 
                                            readOnly 
                                            className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                                        />
                                        <button 
                                            onClick={() => copyToClipboard(referralData.referralCode)}
                                            className="px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Referral Link:</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            value={referralData.referralLink} 
                                            readOnly 
                                            className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-xs sm:text-sm"
                                        />
                                        <button 
                                            onClick={() => copyToClipboard(referralData.referralLink)}
                                            className="px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={handleGenerateReferral}
                                disabled={isLoading}
                                className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
                            >
                                {isLoading ? 'Generating...' : 'Generate Referral Link'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'redeem' && (
                <div className="space-y-4 sm:space-y-6">
                    {/* Coupon Code Redemption */}
                    <div className="bg-white rounded-lg border p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <span>🎫</span> Redeem Coupon Code
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">
                            Have a coupon code? Enter it below to redeem MNAR coins instantly!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter your coupon code"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                disabled={redeemingCoupon}
                            />
                            <button
                                onClick={handleRedeemCouponCode}
                                disabled={!couponCode.trim() || redeemingCoupon}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                    couponCode.trim() && !redeemingCoupon
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {redeemingCoupon ? 'Redeeming...' : 'Redeem'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                            <span>🎁</span> Available Rewards
                        </h3>
                        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                            {availableRewards.map((reward, index) => (
                                <div key={index} className={`border rounded-lg p-3 sm:p-4 ${reward.canAfford ? 'border-green-200 bg-green-50' : 'border-gray-200 opacity-60'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-sm sm:text-base">{reward.description}</h4>
                                        <span className="text-yellow-600 font-bold text-sm sm:text-base">{reward.coins} coins</span>
                                    </div>
                                    <button 
                                        onClick={() => handleRedeemReward(reward.type)}
                                        disabled={!reward.canAfford || redeemingReward === reward.type}
                                        className={`w-full py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                            reward.canAfford && redeemingReward !== reward.type
                                                ? 'bg-black text-white hover:bg-gray-800' 
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {redeemingReward === reward.type 
                                            ? 'Redeeming...' 
                                            : reward.canAfford 
                                                ? 'Redeem Now' 
                                                : `Need ${reward.coins - coinBalance} more coins`
                                        }
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white rounded-lg border">
                    <div className="p-4 sm:p-6 border-b">
                        <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                            <span>📋</span> Transaction History
                        </h3>
                    </div>
                    <div className="divide-y">
                        {coinTransactions.length > 0 ? (
                            coinTransactions.map((transaction, index) => (
                                <div key={index} className="p-3 sm:p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                        <span className={`font-bold text-sm sm:text-base ${transaction.type === 'EARN' ? 'text-green-600' : 'text-red-600'}`}>
                                            {transaction.type === 'EARN' ? '+' : '-'}{Math.abs(transaction.coins)} coins
                                        </span>
                                        <p className="text-xs sm:text-sm text-gray-500 capitalize">{transaction.type.toLowerCase()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 sm:p-8 text-center text-gray-500">
                                <div className="text-3xl sm:text-4xl mb-2">📝</div>
                                <p className="text-sm sm:text-base">No transactions yet. Start earning coins!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coins;
