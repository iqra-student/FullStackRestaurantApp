import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API } from '../api';
import { IMAGE_BASE_URL } from "../api";

import {
  Star,
  Plus,
  Minus,
  ArrowLeft,
  MessageSquare,
  Trash2,
  Send
} from 'lucide-react';
import Header from './Header';
import { useCart } from '../Context/CartContext';

interface Ingredient {
  ingredientId: number;
  name: string;
  description: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  ingredients: Ingredient[];
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

const FoodDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portions, setPortions] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userName: "John Doe",
      rating: 5,
      comment: "Absolutely delicious! The flavors were perfectly balanced and the ingredients were fresh.",
      date: "2024-03-15"
    },
    {
      id: 2,
      userName: "Sarah Smith",
      rating: 4,
      comment: "Great dish, would definitely order again. Maybe a bit too salty for my taste but overall excellent.",
      date: "2024-03-14"
    }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API.menu}/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handlePortionChange = (increment: boolean) => {
    if (increment && portions < (product?.stock || 1)) {
      setPortions(portions + 1);
    } else if (!increment && portions > 1) {
      setPortions(portions - 1);
    }
  };

  const handleAddReview = () => {
    if (newReview.comment.trim()) {
      const review: Review = {
        id: Date.now(),
        userName: "You",
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-800">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Product not found'}</div>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    addToCart({
      productId: product.productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: portions,
    });
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header ismenuOpen={false} setIsMenuOpen={() => { }} />

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Navigation Button */}
        <div className="mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img
                src={`${IMAGE_BASE_URL}/${product.imageUrl}`}
                alt={product.name}
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Bestseller
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  New Arrival
                </span>
              </div>
            </div>


          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {averageRating.toFixed(1)}/5.0
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  ({reviews.length} reviews)
                </button>
              </div>

              {/* Category Tags */}
              <div className="flex gap-2 mb-4">
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  Bestseller
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  New Arrival
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              €{(product.price * portions).toFixed(2)}
            </div>

            {/* Product Description Collapsible */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 py-2"
              >
                <span>Product description</span>
                <Plus className={`w-5 h-5 transition-transform ${showDescription ? 'rotate-45' : ''}`} />
              </button>

              {showDescription && (
                <div className="mt-3 text-gray-600 leading-relaxed">
                  <p className="mb-4">{product.description}</p>
                  <p className="mb-4">
                    A masterpiece crafted to elevate your dining experience to new heights of culinary joy.
                    With layers of carefully selected ingredients and expertly balanced flavors, each bite
                    is a celebration in itself.
                  </p>
                  <p>
                    Prepared with vibrant, fresh ingredients and customizable to your liking, this dish
                    is the perfect centerpiece for special occasions, gatherings, and all your cherished
                    moments. Indulge in pure delight and create unforgettable memories.
                  </p>
                </div>
              )}
            </div>

            {/* Portion Selector */}
            <div className="flex items-center justify-between py-4">
              <span className="font-medium text-gray-900">Portions:</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePortionChange(false)}
                  disabled={portions <= 1}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-600 hover:text-amber-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold text-gray-900 min-w-[2rem] text-center">
                  {portions}
                </span>
                <button
                  onClick={() => handlePortionChange(true)}
                  disabled={portions >= product.stock}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-600 hover:text-amber-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${product.stock <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-600 text-white hover:bg-yellow-800 transform hover:scale-105 shadow-lg"
                }`}
            >
              Add to Cart - €{(product.price * portions).toFixed(2)}
            </button>

            {/* Stock Info */}
            <div className="text-sm text-gray-500 text-center">
              {product.stock} portions available
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
              <span className="text-sm font-medium text-gray-600">
                For {portions} portion{portions > 1 ? "s" : ""}
              </span>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ingredient</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {product.ingredients.map((ingredient) => (
                    <tr key={ingredient.ingredientId}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{ingredient.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {ingredient.description || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-amber-600" />
              Reviews ({reviews.length})
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Review
            </button>
          </div>

          {/* Add Review Form */}
          {showReviewForm && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`w-6 h-6 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Write your review..."
                className="w-full p-3 border border-amber-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReview}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.userName}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  {review.userName === "You" && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 ml-13">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-96 text-center">
              <h2 className="text-xl font-bold mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">Please log in first to add items to your cart.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetailPage;