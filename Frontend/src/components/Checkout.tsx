import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { 
  ArrowLeft, 
  CreditCard,
  MapPin,
  CheckCircle,
  Circle,
  User,
  AlertCircle
} from 'lucide-react';
import Header from '../components/Header';
import {API} from '../api';

interface OrderResponse {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  fullName: string;
  address: string;
  contactNumber: string;
  paymentMethod: string;
  orderItems: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactlessDelivery, setContactlessDelivery] = useState(true);
  
  // Loading and response states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  // Calculate totals (same logic as cart page)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 1.00;
  const total = subtotal + tax + deliveryFee;

  // Form validation
  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!contactNumber.trim()) {
      setError('Contact number is required');
      return false;
    }
    if (!deliveryAddress.trim()) {
      setError('Delivery address is required');
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare request body
      const orderData = {
        fullName: fullName.trim(),
        address: deliveryAddress.trim(),
        contactNumber: contactNumber.trim(),
        paymentMethod,
        orderItems: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      // Make API call
      const response = await fetch(API.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have user tokens
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Order submission failed: ${response.status}`);
      }

      const responseData: OrderResponse = await response.json();
      
      // Set order response for display
      setOrderResponse(responseData);
      
      // Clear cart after successful order
      clearCart();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success page after order is placed
  if (orderResponse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header ismenuOpen={false} setIsMenuOpen={() => {}} />
        
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Order ID: #{orderResponse.orderId}</p>
              <p className="text-gray-600">Order Date: {new Date(orderResponse.orderDate).toLocaleDateString()}</p>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {orderResponse.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-gray-600 text-sm">
                        ${item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Customer Details */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Delivery Details</h3>
                <p className="text-gray-600 text-sm mb-1">{orderResponse.fullName}</p>
                <p className="text-gray-600 text-sm mb-1">{orderResponse.contactNumber}</p>
                <p className="text-gray-600 text-sm">{orderResponse.address}</p>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>${orderResponse.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => navigate('/menu')}
                className="flex-1 py-3 px-6 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/userprofile')}
                className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to cart if empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header ismenuOpen={false} setIsMenuOpen={() => {}} />
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <Link 
              to="/menu"
              className="inline-flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Menu</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Items to Checkout</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart first!</p>
            <Link 
              to="/menu"
              className="inline-flex items-center px-8 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header ismenuOpen={false} setIsMenuOpen={() => {}} />
      
      <div className="w-full mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/cart"
              className="inline-flex items-center space-x-2 text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 m-6 rounded">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Customer Information Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Customer Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Delivery Address *</h2>
              </div>
              
              <div>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Enter your complete delivery address"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <div 
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'stripe' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'stripe' ? 'border-yellow-600 bg-yellow-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'stripe' && <div className="w-full h-full rounded-full bg-yellow-600"></div>}
                    </div>
                    <span className="font-medium text-gray-900">Stripe</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">stripe</div>
                </div>
                
                <div 
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'paypal' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'paypal' ? 'border-yellow-600 bg-yellow-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'paypal' && <div className="w-full h-full rounded-full bg-yellow-600"></div>}
                    </div>
                    <span className="font-medium text-gray-900">PayPal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contactless Delivery Option */}
            <div className="p-6 border-b border-gray-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setContactlessDelivery(!contactlessDelivery)}
              >
                <div className="flex items-center space-x-3">
                  {contactlessDelivery ? (
                    <CheckCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">Contactless Delivery</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6">
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-800'
                }`}
              >
                {isSubmitting ? 'Processing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;