import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const RedemptionCodeInput = ({ cartTotal, onCodeApplied, appliedRedemption, hasActiveCoinDiscounts }) => {
    const { backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const validateCode = async () => {
        if (!code.trim()) {
            toast.error('Please enter a redemption code');
            return;
        }

        // Check for coin discount conflict
        if (hasActiveCoinDiscounts) {
            toast.error('Cannot apply discount code when coin discounts are active. Please remove coin discounts first.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/coins/validate-code', {
                rewardCode: code.trim(),
                cartTotal,
                hasActiveCoinDiscounts
            });

            if (response.data.success) {
                onCodeApplied(response.data.redemption);
                toast.success(response.data.message);
                setCode('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error validating code:', error);
            toast.error('Error validating redemption code');
        } finally {
            setLoading(false);
        }
    };

    const removeCode = () => {
        onCodeApplied(null);
        setCode('');
    };

    if (appliedRedemption) {
        return (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-green-600 font-medium">✓ Code Applied</span>
                            <code className="text-sm bg-green-100 px-2 py-1 rounded">
                                {appliedRedemption.code}
                            </code>
                        </div>
                        <p className="text-sm text-green-700">
                            {(appliedRedemption.type === 'DISCOUNT_10' || 
                              appliedRedemption.type === 'DISCOUNT_30' || 
                              appliedRedemption.type === 'DISCOUNT_50' || 
                              appliedRedemption.type === 'DISCOUNT_100' || 
                              appliedRedemption.type === 'DISCOUNT_200') && 
                                `₹${appliedRedemption.discountAmount} discount applied`
                            }
                        </p>
                    </div>
                    <button
                        onClick={removeCode}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Remove
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>🎁</span>
                Have a Redemption Code?
            </h3>
            
            {/* Warning when coin discounts are active */}
            {hasActiveCoinDiscounts && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-600">⚠️</span>
                        <span className="text-sm text-yellow-800">
                            Coin discounts are active. Remove coin discounts to use redemption codes.
                        </span>
                    </div>
                </div>
            )}
            
            <div className="flex gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter your redemption code (e.g., MNAR200-123456)"
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            hasActiveCoinDiscounts ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        disabled={loading || hasActiveCoinDiscounts}
                    />
                </div>
                <button
                    onClick={validateCode}
                    disabled={loading || !code.trim() || hasActiveCoinDiscounts}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Checking...' : 'Apply'}
                </button>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>• Use your MNAR Coins redemption codes here</p>
                <p>• Get discount codes, free items, and exclusive access</p>
                {!hasActiveCoinDiscounts && (
                    <p>• Check your <span 
                        className="text-blue-600 cursor-pointer hover:underline" 
                        onClick={() => navigate('/redemption')}
                    >redemptions page</span> for available codes</p>
                )}
                {hasActiveCoinDiscounts && (
                    <p className="text-yellow-600">• Only one discount method can be used at a time</p>
                )}
            </div>
        </div>
    );
};

RedemptionCodeInput.propTypes = {
    cartTotal: PropTypes.number.isRequired,
    onCodeApplied: PropTypes.func.isRequired,
    hasActiveCoinDiscounts: PropTypes.bool.isRequired,
    appliedRedemption: PropTypes.shape({
        code: PropTypes.string,
        type: PropTypes.string,
        discountAmount: PropTypes.number,
        freeItem: PropTypes.object,
        redemptionId: PropTypes.string
    })
};

export default RedemptionCodeInput;
