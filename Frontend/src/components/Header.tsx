import React from 'react'
import { ChefHat, Home, Info, Menu, ShoppingCart, Phone, User, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../Context/CartContext";

interface Props {
  ismenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

const Header = ({ ismenuOpen, setIsMenuOpen }: Props) => {

  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const userName = localStorage.getItem("userName");
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("roles");

    navigate("/home");
  };
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-yellow-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 bg-yellow-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <ChefHat className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Foodify
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/home" className="text-gray-900 hover:text-yellow-600 transition-colors duration-200 flex items-center space-x-1 font-medium">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/about" className="text-gray-900 hover:text-yellow-600 transition-colors duration-200 flex items-center space-x-1 font-medium">
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link to="/menu" className="text-gray-900 hover:text-yellow-600 transition-colors duration-200 flex items-center space-x-1 font-medium">
                <Menu className="h-4 w-4" />
                <span>Menu</span>
              </Link>
              <Link to="/contact" className="text-gray-900 hover:text-yellow-600 transition-colors duration-200 flex items-center space-x-1 font-medium">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {userName ? (
                <>
                  {/* Cart Button */}
                  <Link
                    to="/cart"
                    className="flex items-center space-x-2 text-gray-900 hover:text-red-900 transition-colors duration-200 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    {/* Relative wrapper for cart icon */}
                    <div className="relative">
                      <ShoppingCart className="h-6 w-6 text-yellow-600" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link className="text-gray-900 font-medium" to={'/userprofile'}>
                    Hi, {userName}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors duration-200 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center space-x-2 text-gray-900 hover:text-red-900 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-yellow-50 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link to="/register" className="flex items-center space-x-2 bg-yellow-600 text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-500 transition-colors duration-200 font-semibold shadow-md">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!ismenuOpen)}
                className="text-gray-900 hover:text-red-900 focus:outline-none transition-colors duration-200 cursor-pointer"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {ismenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-yellow-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="text-gray-900 hover:text-red-900 block px-3 py-2 transition-colors duration-200">Home</a>
              <Link to= "/about" className="text-gray-900 hover:text-red-900 block px-3 py-2 transition-colors duration-200">About</Link>
              <Link to="/menu" className="text-gray-900 hover:text-red-900 block px-3 py-2 transition-colors duration-200">Menu</Link>
              <Link to="/contact" className="text-gray-900 hover:text-red-900 block px-3 py-2 transition-colors duration-200">Contact</Link>
              <div className="pt-4 pb-3 border-t border-yellow-200">
                <Link to={"/login"} className="text-gray-900 hover:text-red-900 block px-3 py-2 transition-colors duration-200">Sign In</Link>
                <Link to={"/register"} className="bg-yellow-600 text-gray-900 px-4 py-2 rounded-full mx-3 mt-2 hover:bg-yellow-500 transition-colors duration-200 font-semibold">Sign Up</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Header