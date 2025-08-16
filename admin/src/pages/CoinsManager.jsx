import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const CoinsManager = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [actionType, setActionType] = useState('challenge');
    const [coins, setCoins] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // User search and transaction history states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUserForHistory, setSelectedUserForHistory] = useState(null);
    const [userTransactions, setUserTransactions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [transactionLoading, setTransactionLoading] = useState(false);

    // Load users (you might need to create this endpoint)
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        // This would require a new endpoint to get all users
        // For now, we'll just use a placeholder
        try {
            // const response = await axios.get(backendUrl + '/api/admin/users', { headers: { token } });
            // setUsers(response.data.users);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    // Search for users by email or name
    const handleUserSearch = async () => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a search query');
            return;
        }

        setSearchLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/coins/admin/search-users?query=${encodeURIComponent(searchQuery)}`, {
                headers: { token }
            });

            if (response.data.success) {
                setSearchResults(response.data.users);
                if (response.data.users.length === 0) {
                    toast.info('No users found matching your search');
                }
            } else {
                toast.error(response.data.message);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            toast.error('Failed to search users');
            setSearchResults([]);
        }
        setSearchLoading(false);
    };

    // Get transaction history for a specific user
    const getUserTransactionHistory = async (userId, userEmail) => {
        setTransactionLoading(true);
        setSelectedUserForHistory({ _id: userId, email: userEmail });
        
        try {
            const response = await axios.get(`${backendUrl}/api/coins/admin/user-transactions/${userId}`, {
                headers: { token }
            });

            if (response.data.success) {
                setUserTransactions(response.data.transactions);
            } else {
                toast.error(response.data.message);
                setUserTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching user transactions:', error);
            toast.error('Failed to fetch transaction history');
            setUserTransactions([]);
        }
        setTransactionLoading(false);
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAwardCoins = async (e) => {
        e.preventDefault();
        
        // Validate required fields based on action type
        if (!selectedUser || !description) {
            toast.error('Please fill all required fields');
            return;
        }
        
        // For manual adjustments, coins field is required
        if (actionType === 'manual' && !coins) {
            toast.error('Please enter the coin amount for manual adjustment');
            return;
        }

        setIsLoading(true);
        try {
            let endpoint = '';
            let payload = { userId: selectedUser };

            // Check if the selectedUser is an email or ObjectId
            if (selectedUser.includes('@')) {
                payload.email = selectedUser;
                delete payload.userId; // Remove userId if email is provided
            }

            switch (actionType) {
                case 'challenge':
                    endpoint = '/api/coins/award-challenge';
                    payload.challengeDescription = description;
                    break;
                case 'story':
                    endpoint = '/api/coins/award-story-tag';
                    payload.platform = 'Instagram/YouTube';
                    payload.storyUrl = description;
                    break;
                case 'manual':
                    endpoint = '/api/coins/adjust';
                    payload.coins = parseInt(coins);
                    payload.reason = description;
                    break;
                default:
                    toast.error('Invalid action type');
                    return;
            }

            const response = await axios.post(backendUrl + endpoint, payload, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setSelectedUser('');
                setCoins('');
                setDescription('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error processing request');
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-3xl">🪙</span>
                    MNAR Coins Manager
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Award Coins Form */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Award Coins to Users</h3>
                        <form onSubmit={handleAwardCoins} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User ID/Email
                                </label>
                                <input
                                    type="text"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user ID or email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Action Type
                                </label>
                                <select
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="challenge">Challenge Win (+100 coins)</option>
                                    <option value="story">Story Tag (+10 coins)</option>
                                    <option value="manual">Manual Adjustment</option>
                                </select>
                            </div>

                            {actionType === 'manual' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coins Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={coins}
                                        onChange={(e) => setCoins(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter positive or negative number"
                                        required={actionType === 'manual'}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description/Reason
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Enter description or reason for awarding coins"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Processing...' : 'Award Coins'}
                            </button>
                        </form>
                    </div>

                    {/* Quick Actions & Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Coin Rules & Quick Info</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">🏆 Earning Rules</h4>
                                <ul className="text-sm space-y-1 text-gray-600">
                                    <li>• Challenge Win: 100 coins</li>
                                    <li>• Story Tag: 10 coins</li>
                                    <li>• Friend Referral: 50 coins</li>
                                    <li>• Purchase: 1 coin per ₹10</li>
                                    <li>• Signup Bonus: 25 coins</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">🎁 Redemption Rules</h4>
                                <ul className="text-sm space-y-1 text-gray-600">
                                    <li>• Free T-shirt: 300 coins</li>
                                    <li>• ₹200 Discount: 200 coins</li>
                                    <li>• Limited Edition: 500 coins</li>
                                    <li>• Early Access: 150 coins</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Instructions</h4>
                                <ul className="text-sm space-y-1 text-yellow-700">
                                    <li>• Use User ID from database or email</li>
                                    <li>• For manual adjustments, use negative numbers to deduct</li>
                                    <li>• Always provide clear descriptions</li>
                                    <li>• Double-check before awarding</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Search & Transaction History */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>🔍</span> User Search & Transaction History
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* User Search */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Users
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search by email, name, or user ID..."
                                    />
                                    <button
                                        onClick={handleUserSearch}
                                        disabled={searchLoading}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {searchLoading ? '🔍' : 'Search'}
                                    </button>
                                </div>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                                    <div className="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                                        Search Results ({searchResults.length})
                                    </div>
                                    {searchResults.map((user) => (
                                        <div key={user._id} className="px-3 py-2 border-b border-gray-100 hover:bg-gray-50">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-sm">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-gray-400">ID: {user._id}</div>
                                                    <div className="text-xs text-green-600">Balance: {user.coins || 0} coins</div>
                                                </div>
                                                <button
                                                    onClick={() => getUserTransactionHistory(user._id, user.email)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                >
                                                    View History
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Transaction History */}
                        <div className="space-y-4">
                            {selectedUserForHistory && (
                                <div>
                                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                                        <div className="text-sm font-medium text-blue-800">
                                            Transaction History for:
                                        </div>
                                        <div className="text-sm text-blue-600">{selectedUserForHistory.email}</div>
                                        <div className="text-xs text-blue-500">ID: {selectedUserForHistory._id}</div>
                                    </div>

                                    {transactionLoading ? (
                                        <div className="text-center py-4 text-gray-500">
                                            Loading transactions...
                                        </div>
                                    ) : userTransactions.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-md">
                                            <div className="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                                                Recent Transactions ({userTransactions.length})
                                            </div>
                                            {userTransactions.map((transaction, index) => (
                                                <div key={index} className="px-3 py-3 border-b border-gray-100">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium text-gray-800">
                                                                {transaction.description}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {formatDate(transaction.createdAt)}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                Type: {transaction.type}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-sm font-bold ${
                                                                transaction.type === 'EARN' 
                                                                    ? 'text-green-600' 
                                                                    : 'text-red-600'
                                                            }`}>
                                                                {transaction.type === 'EARN' ? '+' : '-'}
                                                                {Math.abs(transaction.amount)} coins
                                                            </div>
                                                            <div className="text-xs text-gray-500 capitalize">
                                                                {transaction.type.toLowerCase()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No transactions found for this user.
                                        </div>
                                    )}
                                </div>
                            )}

                            {!selectedUserForHistory && (
                                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                                    <div className="text-3xl mb-2">📊</div>
                                    <p>Search for a user above to view their transaction history</p>
                                    <p className="text-sm mt-1">You can search by email, name, or user ID</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinsManager;
