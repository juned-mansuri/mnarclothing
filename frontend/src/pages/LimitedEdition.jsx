import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import ProductItem from '../components/ProductItem';

const LimitedEdition = () => {
    const { backendUrl, token, navigate } = useContext(ShopContext);
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [limitedEditionProducts, setLimitedEditionProducts] = useState([]);
    const [accessExpiryDate, setAccessExpiryDate] = useState(null);

    useEffect(() => {
        if (token) {
            checkLimitedEditionAccess();
            loadLimitedEditionProducts();
        } else {
            setLoading(false);
        }
    }, [token]);

    const checkLimitedEditionAccess = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/coins/check-access/LIMITED_EDITION', {
                headers: { token }
            });

            if (response.data.success) {
                setHasAccess(response.data.hasAccess);
                if (response.data.expiryDate) {
                    setAccessExpiryDate(new Date(response.data.expiryDate));
                }
            }
        } catch (error) {
            console.error('Error checking limited edition access:', error);
            setHasAccess(false);
        } finally {
            setLoading(false);
        }
    };

    const loadLimitedEditionProducts = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/limited-edition', {
                headers: { token }
            });

            if (response.data.success) {
                setLimitedEditionProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error loading limited edition products:', error);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-4xl mb-4">⭐</div>
                    <p>Checking your limited edition access...</p>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="text-6xl mb-6">⭐</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Limited Edition Collection</h1>
                    <p className="text-gray-600 mb-8">
                        Access our exclusive limited edition designs available only to MNAR Coin holders! 
                        These unique pieces are crafted in small quantities for our most dedicated fans.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors mr-4"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/coins')}
                        className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Limited Edition Access Required</h1>
                    <p className="text-gray-600 mb-8">
                        This exclusive collection is only available to users who have redeemed MNAR Coins for Limited Edition access. 
                        Unlock unique designs that are not available anywhere else!
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">⭐ Limited Edition Benefits</h3>
                        <ul className="text-left text-yellow-700 space-y-2">
                            <li>• Exclusive designs not available in regular collection</li>
                            <li>• Limited quantity items - true collector pieces</li>
                            <li>• Premium materials and unique finishes</li>
                            <li>• Special edition packaging and certificates</li>
                            <li>• Access to designer collaboration pieces</li>
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
                        <span className="text-5xl">⭐</span>
                        <h1 className="text-4xl font-bold text-gray-800">Limited Edition Collection</h1>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Welcome to your exclusive limited edition collection! These unique designs are only available to coin holders.
                    </p>
                    {accessExpiryDate && (
                        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">
                            <span>✅</span>
                            Access valid until {accessExpiryDate.toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Limited Edition Products */}
                {limitedEditionProducts.length > 0 ? (
                    <div>
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-2">✨ Exclusive Collection</h2>
                            <p className="text-yellow-100">
                                These limited edition pieces are available only to MNAR Coin holders. Once they are gone, they are gone forever!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                            {limitedEditionProducts.map((item, index) => (
                                <div key={index} className="relative">
                                    <ProductItem 
                                        name={item.name} 
                                        id={item._id} 
                                        price={item.price} 
                                        image={item.image} 
                                    />
                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                        LIMITED
                                    </div>
                                    {item.quantity && item.quantity <= 10 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                            Only {item.quantity} left!
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-gradient-to-br from-gray-50 to-yellow-50 rounded-xl p-6 text-center border border-yellow-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">🏆 Collector Status</h3>
                            <p className="text-gray-600 mb-4">
                                As a limited edition access holder, you are part of an exclusive group of MNAR collectors. 
                                These pieces represent the finest in our craftsmanship and design.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white p-4 rounded-lg border">
                                    <div className="text-2xl mb-2">🎨</div>
                                    <h4 className="font-semibold">Unique Designs</h4>
                                    <p className="text-sm text-gray-600">Exclusive patterns and artwork</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border">
                                    <div className="text-2xl mb-2">🔢</div>
                                    <h4 className="font-semibold">Limited Quantities</h4>
                                    <p className="text-sm text-gray-600">Numbered collector pieces</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border">
                                    <div className="text-2xl mb-2">🌟</div>
                                    <h4 className="font-semibold">Premium Quality</h4>
                                    <p className="text-sm text-gray-600">Finest materials and finishes</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/coins')}
                                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors mt-6"
                            >
                                Manage Your MNAR Coins
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">New Limited Editions Coming Soon</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Our designers are working on exclusive new pieces for the limited edition collection. 
                            Check back soon for unique designs you cannot find anywhere else!
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg mx-auto">
                            <h4 className="font-semibold text-yellow-800 mb-2">What Makes Our Limited Editions Special:</h4>
                            <ul className="text-left text-yellow-700 space-y-1">
                                <li>• Hand-selected premium materials</li>
                                <li>• Unique artwork from featured artists</li>
                                <li>• Numbered certificates of authenticity</li>
                                <li>• Special edition packaging</li>
                                <li>• Resale value for true collectors</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LimitedEdition;
