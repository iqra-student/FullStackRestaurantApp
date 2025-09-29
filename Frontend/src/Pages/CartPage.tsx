import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { IMAGE_BASE_URL } from '../api';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Star,
  Trash2,
  Gift,
  CreditCard,
  ShoppingBag,
  X
} from 'lucide-react';
import Header from '../components/Header';


const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [voucherCode, setVoucherCode] = useState('');
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 2.00 : 0;
  const voucherDiscount = appliedVoucher ? subtotal * 0.1 : 0; // 10% discount if voucher applied
  const total = subtotal + deliveryFee - voucherDiscount;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim().toLowerCase() === 'save10') {
      setAppliedVoucher(voucherCode);
      setShowVoucherInput(false);
      setVoucherCode('');
    } else {
      alert('Invalid voucher code');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header ismenuOpen={false} setIsMenuOpen={() => {}} />
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <Link 
              to="/menu"
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Menu</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items to your cart to get started!</p>
            <Link 
              to="/menu"
              className="inline-flex items-center px-8 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-800 transition-colors"
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
              to="/menu"
              className="inline-flex items-center space-x-2 text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.productId} className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.imageUrl ? `${IMAGE_BASE_URL}/${item.imageUrl}` : '/api/placeholder/80/80'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">by Food Express</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">4.7</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="mx-3 font-semibold text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center hover:bg-yellow-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voucher Section */}
          <div className="border-t border-gray-100 p-4">
            {appliedVoucher ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Voucher Applied: {appliedVoucher}</span>
                </div>
                <button
                  onClick={handleRemoveVoucher}
                  className="text-green-600 hover:text-green-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowVoucherInput(!showVoucherInput)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">Enter your voucher code</span>
                  </div>
                  <ArrowLeft className={`w-4 h-4 text-gray-400 transform transition-transform ${showVoucherInput ? 'rotate-90' : '-rotate-90'}`} />
                </button>
                
                {showVoucherInput && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Enter code (try: SAVE10)"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            {appliedVoucher && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${voucherDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total Amount:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between bg-yellow-600 text-white p-4 rounded-xl">
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
              <button 
                onClick={() => navigate('/checkout')}
                className="bg-white text-yellow-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Checkout</span>
              </button>
            </div>
            
            <button
              onClick={clearCart}
              className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;