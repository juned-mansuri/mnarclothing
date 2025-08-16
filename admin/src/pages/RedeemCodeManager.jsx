import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const RedeemCodeManager = ({ token }) => {
    const [activeTab, setActiveTab] = useState('create');
    const [isLoading, setIsLoading] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [codes, setCodes] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        status: 'all',
        page: 1
    });

    // Form state for creating new codes
    const [formData, setFormData] = useState({
        rewardType: 'DISCOUNT',
        customCode: '',
        description: '',
        discountAmount: '',
        coinAmount: '',
        freeItemType: 'FREE_TEE',
        usageLimit: 1,
        expiryDays: 30,
        isActive: true
    });

    useEffect(() => {
        fetchAnalytics();
        fetchCodes();
    }, [filters]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/coins/admin/analytics`, {
                headers: { token }
            });
            if (response.data.success) {
                setAnalytics(response.data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const fetchCodes = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/coins/admin/codes`, {
                headers: { token },
                params: filters
            });
            if (response.data.success) {
                setCodes(response.data.redemptions);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching codes:', error);
            toast.error('Failed to fetch redeem codes');
        }
    };

    const handleCreateCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/api/coins/admin/create-code`, formData, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Redeem code created successfully!');
                setFormData({
                    rewardType: 'DISCOUNT',
                    customCode: '',
                    description: '',
                    discountAmount: '',
                    coinAmount: '',
                    freeItemType: 'FREE_TEE',
                    usageLimit: 1,
                    expiryDays: 30,
                    isActive: true
                });
                fetchCodes();
                fetchAnalytics();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error creating code:', error);
            toast.error('Failed to create redeem code');
        }
        setIsLoading(false);
    };

    const handleStatusUpdate = async (codeId, newStatus) => {
        try {
            const response = await axios.put(`${backendUrl}/api/coins/admin/update-code-status`, {
                codeId,
                status: newStatus
            }, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success(`Status updated to ${newStatus}`);
                fetchCodes();
                fetchAnalytics();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDeleteCode = async (codeId) => {
        if (!window.confirm('Are you sure you want to delete this redeem code?')) {
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/api/coins/admin/delete-code/${codeId}`, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Redeem code deleted successfully');
                fetchCodes();
                fetchAnalytics();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting code:', error);
            toast.error('Failed to delete redeem code');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'USED': return 'bg-gray-100 text-gray-800';
            case 'EXPIRED': return 'bg-red-100 text-red-800';
            case 'INACTIVE': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-3xl">🎫</span>
                        Redeem Code Manager
                    </h1>
                    <p className="text-gray-600 mt-1">Create and manage custom redeem codes for your customers</p>
                </div>

                {/* Analytics Dashboard */}
                {analytics && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalCodes}</div>
                                <div className="text-sm text-blue-600">Total Codes</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{analytics.overview.activeCodes}</div>
                                <div className="text-sm text-green-600">Active Codes</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">{analytics.overview.usedCodes}</div>
                                <div className="text-sm text-gray-600">Used Codes</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">{analytics.overview.expiredCodes}</div>
                                <div className="text-sm text-red-600">Expired Codes</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{analytics.overview.adminCreatedCodes}</div>
                                <div className="text-sm text-purple-600">Admin Created</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'create'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Create New Code
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'manage'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Manage Codes
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'create' && (
                        <div className="max-w-2xl">
                            <h3 className="text-lg font-semibold mb-4">Create New Redeem Code</h3>
                            <form onSubmit={handleCreateCode} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reward Type
                                        </label>
                                        <select
                                            value={formData.rewardType}
                                            onChange={(e) => setFormData({ ...formData, rewardType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="DISCOUNT">Discount Code</option>
                                            <option value="COINS">MNAR Coins</option>
                                            <option value="FREE_ITEM">Free Item</option>
                                            <option value="SPECIAL_ACCESS">Special Access</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Custom Code (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customCode}
                                            onChange={(e) => setFormData({ ...formData, customCode: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Leave empty for auto-generation"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Description of the reward"
                                        required
                                    />
                                </div>

                                {formData.rewardType === 'DISCOUNT' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.discountAmount}
                                            onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter discount amount"
                                            required={formData.rewardType === 'DISCOUNT'}
                                        />
                                    </div>
                                )}

                                {formData.rewardType === 'COINS' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coin Amount
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.coinAmount}
                                            onChange={(e) => setFormData({ ...formData, coinAmount: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter number of coins to give"
                                            required={formData.rewardType === 'COINS'}
                                            min="1"
                                        />
                                    </div>
                                )}

                                {formData.rewardType === 'FREE_ITEM' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Free Item Type
                                        </label>
                                        <select
                                            value={formData.freeItemType}
                                            onChange={(e) => setFormData({ ...formData, freeItemType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="FREE_TEE">Free T-shirt</option>
                                            <option value="FREE_HOODIE">Free Hoodie</option>
                                            <option value="FREE_CAP">Free Cap</option>
                                            <option value="FREE_STICKERS">Free Stickers</option>
                                        </select>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Usage Limit
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            placeholder="How many times can this code be used"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expiry Days
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.expiryDays}
                                            onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            placeholder="Number of days until expiry"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <label className="text-sm text-gray-700">Make code active immediately</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating...' : 'Create Redeem Code'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'manage' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Manage Redeem Codes</h3>
                                <div className="flex gap-2">
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="used">Used</option>
                                        <option value="expired">Expired</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Expires
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {codes.map((code) => (
                                            <tr key={code._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{code.rewardCode}</div>
                                                    {code.isAdminCreated && (
                                                        <div className="text-xs text-purple-600">Admin Created</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {code.rewardType}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                    {code.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {code.usedCount}/{code.usageLimit}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(code.status)}`}>
                                                        {code.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(code.expiresAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {code.status === 'ACTIVE' ? (
                                                        <button
                                                            onClick={() => handleStatusUpdate(code._id, 'INACTIVE')}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : code.status === 'INACTIVE' ? (
                                                        <button
                                                            onClick={() => handleStatusUpdate(code._id, 'ACTIVE')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Activate
                                                        </button>
                                                    ) : null}
                                                    <button
                                                        onClick={() => handleDeleteCode(code._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="mt-4 flex justify-center space-x-2">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setFilters({ ...filters, page })}
                                            className={`px-3 py-1 rounded-md text-sm ${
                                                page === pagination.currentPage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RedeemCodeManager;
