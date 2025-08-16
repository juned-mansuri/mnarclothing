import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductItem from '../components/ProductItem';

const EarlyAccess = () => {
    const { backendUrl, token, navigate } = useContext(ShopContext);
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [earlyAccessProducts, setEarlyAccessProducts] = useState([]);
    const [accessExpiryDate, setAccessExpiryDate] = useState(null);

    useEffect(() => {
        if (token) {
            checkEarlyAccess();
            loadEarlyAccessProducts();
        } else {
            setLoading(false);
        }
    }, [token]);

    const checkEarlyAccess = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/coins/check-access/EARLY_ACCESS', {
                headers: { token }
            });

            if (response.data.success) {
                setHasAccess(response.data.hasAccess);
                if (response.data.expiryDate) {
                    setAccessExpiryDate(new Date(response.data.expiryDate));
                }
            }
        } catch (error) {
            console.error('Error checking early access:', error);
            setHasAccess(false);
        } finally {
            setLoading(false);
        }
    };

    const loadEarlyAccessProducts = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/early-access', {
                headers: { token }
            });

            if (response.data.success) {
                setEarlyAccessProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error loading early access products:', error);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-4xl mb-4">🚀</div>
                    <p>Checking your early access...</p>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="text-6xl mb-6">🚀</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Early Access</h1>
                    <p className="text-gray-600 mb-8">
                        Get exclusive early access to new MNAR drops before they go public! 
                        Login and redeem coins to unlock this premium feature.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors mr-4"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/coins')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Earn Coins
                    </button>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="text-6xl mb-6">🔒</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Early Access Required</h1>
                    <p className="text-gray-600 mb-8">
                        You need to redeem MNAR Coins for Early Access to view this exclusive content. 
                        Be the first to see our latest drops!
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">🎯 How to Get Early Access</h3>
                        <ul className="text-left text-yellow-700 space-y-2">
                            <li>• Earn MNAR Coins through purchases and activities</li>
                            <li>• Redeem coins for Early Access reward</li>
                            <li>• Get notified about new drops 24-48 hours early</li>
                            <li>• Shop exclusive items before public release</li>
                        </ul>
                    </div>
                    <button 
                        onClick={() => navigate('/coins')}
                        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Redeem Coins for Access
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-5xl">🚀</span>
                        <h1 className="text-4xl font-bold text-gray-800">Early Access</h1>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Welcome to your exclusive early access! See new MNAR drops before anyone else.
                    </p>
                    {accessExpiryDate && (
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
                            <span>✅</span>
                            Access valid until {accessExpiryDate.toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Early Access Products */}
                {earlyAccessProducts.length > 0 ? (
                    <div>
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-2">🔥 Coming Soon - Early Preview</h2>
                            <p className="text-blue-100">
                                These items will be available to the public in 24-48 hours. You get to see them first!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                            {earlyAccessProducts.map((item, index) => (
                                <ProductItem 
                                    key={index} 
                                    name={item.name} 
                                    id={item._id} 
                                    price={item.price} 
                                    image={item.image} 
                                />
                            ))}
                        </div>

                        <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Stay Updated</h3>
                            <p className="text-gray-600 mb-4">
                                Check back regularly for new early access items. We're always working on exciting new designs!
                            </p>
                            <button 
                                onClick={() => navigate('/coins')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Manage Your MNAR Coins
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Early Access Items Yet</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We're working on some amazing new designs! Check back soon for exclusive early access to new drops.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
                            <h4 className="font-semibold text-blue-800 mb-2">Your Early Access Benefits:</h4>
                            <ul className="text-left text-blue-700 space-y-1">
                                <li>• First to see new collections</li>
                                <li>• 24-48 hour head start on shopping</li>
                                <li>• Access to limited quantity items</li>
                                <li>• Exclusive early bird pricing (when available)</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EarlyAccess;
