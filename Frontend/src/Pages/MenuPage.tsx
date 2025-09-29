import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api';

import Header from '../components/Header';
import { useCart } from '../Context/CartContext';
import Footer from '../components/Footer';

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

const MenuCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addToCart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userName");

  // Categories mapping - maps display names to food types
  const categories = ['All', 'Fast Food', 'Desi', 'Sweet', 'Beverages'];

  // Map categories to food items that should be included
  const categoryMapping: Record<string, string[]> = {
    'Fast Food': ['pizza', 'burger', 'fries', 'sandwich', 'wrap', 'chicken wings', 'nuggets', 'hot dog', 'fried'],
    'Desi': ['biryani', 'karahi', 'seekh', 'kebab', 'curry', 'rice', 'naan', 'tandoori', 'masala', 'dal', 'chapati', 'roti'],
    'Sweet': ['cake', 'dessert', 'ice cream', 'pastry', 'cookie', 'chocolate', 'sweet', 'pudding', 'pie', 'donut'],
    'Beverages': ['juice', 'drink', 'coffee', 'tea', 'soda', 'water', 'smoothie', 'milkshake', 'beverage', 'cold drink']
  };



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API.menu);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Product[] = await response.json();
        console.log('Fetched products:', data); // Debug log to see actual data
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category and search query
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      const categoryKeywords = categoryMapping[selectedCategory] || [];

      filtered = filtered.filter(product => {
        // Check if product name or description contains any of the category keywords
        const productText = (product.name + ' ' + product.description + ' ' + product.categoryName).toLowerCase();

        return categoryKeywords.some(keyword =>
          productText.includes(keyword.toLowerCase())
        );
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);



  const handleViewDetails = (productId: number) => {
    console.log('View details for product:', productId);
    navigate(`/product/${productId}`);
  };




  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      setShowLoginModal(true); // show modal
      return;
    }

    // If logged in → add product to cart
    addToCart({
      productId: product.productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header ismenuOpen={false} setIsMenuOpen={() => { }} />

        {/* Hero Section */}
        <div className="relative h-80 bg-gradient-to-r from-amber-900 to-amber-700">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-5xl font-bold text-white text-center">
              Explore Our Delicious Menu
            </h1>
          </div>
        </div>

        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header ismenuOpen={false} setIsMenuOpen={() => { }} />

        {/* Hero Section */}
        <div className="relative h-80 bg-gradient-to-r from-amber-900 to-amber-700">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-5xl font-bold text-white text-center">
              Explore Our Delicious Menu
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg">Error loading products: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-stone-50'>
      <Header ismenuOpen={false} setIsMenuOpen={() => { }} />

      {/* Hero Section with Background Image */}
      <div className="relative h-80 bg-cover bg-center bg-gradient-to-r from-amber-900 to-amber-700">
        <div className="absolute inset-0 bg-[url('https://t4.ftcdn.net/jpg/03/57/91/11/360_F_357911175_lUNZj0iZx0B6UEj3JyJwhKnJQv1jT1i4.jpg')] bg-cover bg-center bg-black/40 bg-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Explore Our Delicious Menu
            </h1>
            <p className="text-xl text-gray-200">
              Discover amazing flavors from around the world
            </p>
          </div>
        </div>
      </div>

      {/* Categories and Search Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                  ? 'bg-amber-800 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-800'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Items' : selectedCategory}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredProducts.length} items)
              </span>
            </h2>
            {searchQuery && (
              <p className="text-gray-600">
                Search results for "<span className="font-semibold">{searchQuery}</span>"
              </p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-200">
                <img
                  src={`https://localhost:7133/${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">Out of Stock</span>
                  </div>
                )}

                {/* Category Badge */}
                {/* <div className="absolute top-4 left-4">
                  <span className="bg-amber-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.categoryName}
                  </span>
                </div> */}
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
               <div className="flex gap-4">
                <button
                  onClick={() => handleViewDetails(product.productId)}
                  disabled={product.stock <= 0}
                  className={`w-50% py-3 px-4 rounded-lg font-medium transition-all duration-300 ${product.stock <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-800 text-white hover:bg-amber-900 transform hover:scale-105'
                    }`}
                >
                  View Details
                </button>
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${product.stock <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 transform hover:scale-105"
                    }`}
                >
                  Add to Cart
                </button>
                </div>
                {showLoginModal && (
                  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                      <h2 className="text-xl font-bold mb-4">Login Required</h2>
                      <p className="mb-6">Please log in first to add items to your cart.</p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setShowLoginModal(false)}
                          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => navigate("/login")}
                          className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 cursor-pointer"
                        >
                          Go to Login
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No results found for "${searchQuery}" in ${selectedCategory === 'All' ? 'all categories' : selectedCategory}`
                : `No items available in ${selectedCategory} category`
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
    
  );
};

export default MenuCards;