import { useState, useEffect, useContext, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyRedemptions = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [redemptions, setRedemptions] = useState([]);
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('redemptions');

    const fetchRedemptions = useCallback(async () => {
        try {
            const response = await axios.get(backendUrl + '/api/coins/redemptions', {
                headers: { token }
            });

            if (response.data.success) {
                setRedemptions(response.data.redemptions);
                setReferralData(response.data.referralData);
            }
        } catch (error) {
            console.error('Error fetching redemptions:', error);
            toast.error('Error loading redemptions');
        } finally {
            setLoading(false);
        }
    }, [backendUrl, token]);

    useEffect(() => {
        if (token) {
            fetchRedemptions();
        }
    }, [token, fetchRedemptions]);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard!');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-green-600 bg-green-100';
            case 'USED':
                return 'text-gray-600 bg-gray-100';
            case 'EXPIRED':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getRewardIcon = (type) => {
        switch (type) {
            case 'DISCOUNT_10':
            case 'DISCOUNT_30':
            case 'DISCOUNT_50':
            case 'DISCOUNT_100':
            case 'DISCOUNT_200':
                return '�';
            default:
                return '🎁';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="text-center">Loading your redemptions...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl">🎁</span>
                    My Redemptions & Referrals
                </h1>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('redemptions')}
                        className={`px-4 py-2 font-medium text-sm ${
                            activeTab === 'redemptions'
                                ? 'border-b-2 border-black text-black'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        My Redemptions
                    </button>
                    <button
                        onClick={() => setActiveTab('referrals')}
                        className={`px-4 py-2 font-medium text-sm ${
                            activeTab === 'referrals'
                                ? 'border-b-2 border-black text-black'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Referral Program
                    </button>
                </div>

                {/* Redemptions Tab */}
                {activeTab === 'redemptions' && (
                    <>
                        {redemptions.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🪙</div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Redemptions Yet</h3>
                                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">Start earning MNAR Coins and redeem exciting rewards!</p>
                                <a 
                                    href="/coins" 
                                    className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
                                >
                                    Earn Coins Now
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                {redemptions.map((redemption) => (
                            <div 
                                key={redemption._id} 
                                className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6"
                            >
                                <div className="flex items-start justify-between flex-col sm:flex-row gap-3 sm:gap-0">
                                    <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                                        <div className="text-2xl sm:text-3xl flex-shrink-0">
                                            {getRewardIcon(redemption.rewardType)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                                {redemption.rewardData.description}
                                            </h3>
                                            <div className="space-y-2">
                                                {/* Show code for discount rewards */}
                                                {(redemption.rewardType === 'DISCOUNT_10' || 
                                                  redemption.rewardType === 'DISCOUNT_30' || 
                                                  redemption.rewardType === 'DISCOUNT_50' || 
                                                  redemption.rewardType === 'DISCOUNT_100' || 
                                                  redemption.rewardType === 'DISCOUNT_200') && (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs sm:text-sm font-medium text-gray-600">Code:</span>
                                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-mono break-all">
                                                            {redemption.rewardCode}
                                                        </code>
                                                        <button
                                                            onClick={() => copyToClipboard(redemption.rewardCode)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex-shrink-0"
                                                            title="Copy code"
                                                        >
                                                            📋
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                                    <span>Coins Used: {redemption.coinsRedeemed}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>
                                                        Redeemed: {new Date(redemption.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>
                                                        Expires: {new Date(redemption.expiresAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {redemption.usedAt && (
                                                    <div className="text-xs sm:text-sm text-gray-600">
                                                        Used on: {new Date(redemption.usedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end gap-2 self-start">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                                            {redemption.status}
                                        </span>
                                        {redemption.status === 'ACTIVE' && (redemption.rewardType === 'DISCOUNT_10' || 
                                                                                  redemption.rewardType === 'DISCOUNT_30' || 
                                                                                  redemption.rewardType === 'DISCOUNT_50' || 
                                                                                  redemption.rewardType === 'DISCOUNT_100' || 
                                                                                  redemption.rewardType === 'DISCOUNT_200') && (
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 mb-1">Ready to use</div>
                                                <div className="text-xs text-blue-600">
                                                    Apply at checkout
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Instructions based on reward type */}
                                <div className="mt-3 sm:mt-4 p-3 bg-gray-50 rounded-md">
                                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">How to use:</h4>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {redemption.rewardType === 'DISCOUNT_10' && 
                                            'Enter this code at checkout to get ₹10 off your order.'
                                        }
                                        {redemption.rewardType === 'DISCOUNT_30' && 
                                            'Enter this code at checkout to get ₹30 off your order.'
                                        }
                                        {redemption.rewardType === 'DISCOUNT_50' && 
                                            'Enter this code at checkout to get ₹50 off your order.'
                                        }
                                        {redemption.rewardType === 'DISCOUNT_100' && 
                                            'Enter this code at checkout to get ₹100 off your order.'
                                        }
                                        {redemption.rewardType === 'DISCOUNT_200' && 
                                            'Enter this code at checkout to get ₹200 off your order.'
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                        )}
                    </>
                )}

                {/* Referrals Tab */}
                {activeTab === 'referrals' && (
                    <div className="space-y-6">
                        {referralData && (
                            <>
                                {/* Referral Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg border border-green-200">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-700">{referralData.totalReferrals}</div>
                                            <div className="text-sm text-green-600">Friends Referred</div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-700">{referralData.totalReferralCoins}</div>
                                            <div className="text-sm text-yellow-600">Coins Earned</div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg border border-blue-200">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-700">{referralData.coinsPerReferral}</div>
                                            <div className="text-sm text-blue-600">Coins per Referral</div>
                                        </div>
                                    </div>
                                </div>

                                {/* My Referral Code */}
                                {referralData.userReferralCode && (
                                    <div className="bg-white border rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <span className="text-2xl">🔗</span>
                                            My Referral Code
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <input 
                                                type="text" 
                                                value={referralData.userReferralCode} 
                                                readOnly 
                                                className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 font-mono text-sm"
                                            />
                                            <button 
                                                onClick={() => copyToClipboard(referralData.userReferralCode)}
                                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600">Share this code with friends to earn {referralData.coinsPerReferral} coins for each successful signup!</p>
                                    </div>
                                )}

                                {/* Referral History */}
                                {referralData.referralHistory && referralData.referralHistory.length > 0 && (
                                    <div className="bg-white border rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <span className="text-2xl">👥</span>
                                            Referral History
                                        </h3>
                                        <div className="space-y-3">
                                            {referralData.referralHistory.map((referral, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <div className="font-medium text-sm">{referral.referredUserName}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(referral.completedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-green-600 font-semibold text-sm">
                                                            +{referral.coinsAwarded} coins
                                                        </div>
                                                        <div className="text-xs text-gray-500">Earned</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {referralData.totalReferrals === 0 && (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-4">👥</div>
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Referrals Yet</h3>
                                        <p className="text-sm text-gray-500 mb-6">Start referring friends and earn {referralData.coinsPerReferral} coins for each successful signup!</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRedemptions;
