import React, { useState, useEffect } from 'react';
import {
    User,
    CreditCard,
    Package,
    Loader2,
    AlertCircle,
    ShoppingBag
} from 'lucide-react';
import { API } from '../api';
import Header from '../components/Header';

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface Order {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    paymentMethod: string;
    status?: string;
    orderItems: OrderItem[];
    fullName?: string;
    contactNumber?: string;
    address?: string;
}

interface UserInfo {
    fullName: string;
    contactNumber: string;
    address: string;
}

const ProfileOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

    useEffect(() => {
        // Set default user info since we don't have a user profile endpoint
        setUserInfo({
            fullName: 'User',
            contactNumber: '',
            address: ''
        });
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please login again.');
                setLoading(false);
                return;
            }

            const response = await fetch(API.userorder, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });



            if (!response.ok) {
                if (response.status === 401) {
                    setError('Your session has expired. Please login again.');
                } else if (response.status === 404) {
                    setError('No orders found.');
                } else {
                    setError(`Failed to fetch orders: ${response.statusText}`);
                }
                setLoading(false);
                return;
            }

            //   const ordersData: Order[] = await response.json();
            const data = await response.json();


            const ordersData: Order[] = Array.isArray(data) ? data : [data];

            const processedOrders = ordersData.map(order => ({
                ...order,
                status: order.status || 'Processing',
                orderItems: order.orderItems || []
            }));

            setOrders(processedOrders);
            if (ordersData.length > 0) {
                const latestOrder = ordersData[ordersData.length - 1];

                setUserInfo({
                    fullName: latestOrder.fullName || 'User',
                    contactNumber: latestOrder.contactNumber || '',
                    address: latestOrder.address || ''
                });
            }

        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'returned':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredOrders = activeTab === 'All'
        ? orders
        : orders.filter(order => order.status === activeTab);

    return (
        <>
         <Header ismenuOpen={false} setIsMenuOpen={() => { }} />

        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gray-900 text-white px-4 py-6">
                <div className="text-center">
                    <h1 className="text-xl font-bold">My Orders</h1>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-300 mt-1">
                        <span>Home</span>
                        <span>•</span>
                        <span>My Account</span>
                        <span>•</span>
                        <span>My Orders</span>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-sm min-h-screen p-4">
                    {/* User Profile */}
                    <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {userInfo?.fullName || 'Loading...'}
                            </h3>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                        <div className="text-gray-600 hover:text-gray-900 py-2 px-3 rounded cursor-pointer">
                            Personal Information
                        </div>
                        <div className="text-gray-600 hover:text-gray-900 py-2 px-3 rounded cursor-pointer">
                            Address
                        </div>
                        <div className="text-gray-600 hover:text-gray-900 py-2 px-3 rounded cursor-pointer">
                            Wishlist
                        </div>
                        <div className="bg-gray-100 text-gray-900 py-2 px-3 rounded font-medium">
                            My Orders
                        </div>
                        <div className="text-gray-600 hover:text-gray-900 py-2 px-3 rounded cursor-pointer">
                            My Order Details
                        </div>
                        <div className="text-gray-600 hover:text-gray-900 py-2 px-3 rounded cursor-pointer">
                            Notifications
                        </div>
                        <div className="text-gray-600 hover:text-gray-900 py-2 px-3 rounded cursor-pointer">
                            Change Password
                        </div>
                        <div className="text-red-600 hover:text-red-700 py-2 px-3 rounded cursor-pointer">
                            Logout
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                            <p className="text-sm text-gray-600">
                                Have questions or concerns regarding your account?
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4">
                    <div className="max-w-4xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

                        {/* Tab Navigation */}
                        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
                                <span className="ml-2 text-gray-600">Loading orders...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                    <p className="text-red-700">{error}</p>
                                </div>
                                {error.includes('login') && (
                                    <div className="mt-3">
                                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                                            Login Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Orders List */}
                        {!loading && !error && filteredOrders.length === 0 && (
                            <div className="text-center py-12">
                                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                                <p className="text-gray-600">
                                    {activeTab === 'All'
                                        ? "You haven't placed any orders yet."
                                        : `No orders found with status "${activeTab}".`
                                    }
                                </p>
                            </div>
                        )}

                        {!loading && filteredOrders.length > 0 && (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div key={order.orderId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                        {/* Order Header */}
                                        <div className="p-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                        Rate & Review Product
                                                    </button>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    ${order.totalAmount.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>{formatDate(order.orderDate)}</span>
                                                <span>Order No: {order.orderId}</span>
                                            </div>
                                            {order.paymentMethod && (
                                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                                    <CreditCard className="w-4 h-4 mr-1" />
                                                    <span>Payment: {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Items */}
                                        <div className="p-4">
                                            {order.orderItems && order.orderItems.length > 0 ? (
                                                <>
                                                    {order.orderItems.slice(0, 2).map((item, index) => (
                                                        <div key={`${order.orderId}-${item.productId}`} className={`flex items-center space-x-4 ${index > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''}`}>
                                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                <Package className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                                                                <div className="text-sm text-gray-600">
                                                                    <span>Qty: {item.quantity}</span>
                                                                    <span className="mx-2">•</span>
                                                                    <span>${item.unitPrice.toFixed(2)} each</span>
                                                                </div>
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    Total: ${item.totalPrice.toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {order.orderItems.length > 2 && (
                                                        <div className="mt-3 text-sm text-gray-600 text-center py-2 border-t border-gray-100">
                                                            + {order.orderItems.length - 2} more item(s)
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                    <p>No items found for this order</p>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                    View Order Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ProfileOrdersPage;