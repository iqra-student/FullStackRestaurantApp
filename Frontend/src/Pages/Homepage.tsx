import { useState } from 'react';
import bgFood from "../assets/video/bg-food.mp4";
import FeaturedCard from './FeaturedCard';
import Header from '../components/Header';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import FoodShowcase from '../components/FoodshowCase';
import Footer from '../components/Footer';
import News from '../components/News';



const FoodifyRestaurant = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50" >
     <Header  ismenuOpen = {isMenuOpen} setIsMenuOpen = {setIsMenuOpen} />

       {/* Hero Section with Video Background */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={bgFood} type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Your Favorite Meals, Anytime, Anywhere
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Fresh ingredients, bold flavors, delivered to your doorstep
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 text-yellow-600 px-6 py-2 rounded-4xl text-md font-semibold hover:bg-yellow-600 transition-colors duration-200 shadow-lg cursor-pointer">
              <span className="flex items-center text-black justify-center space-x-2">
                <span>Order Now</span>
                <ShoppingCart className="h-5 w-5" />
              </span>
            </button>
            <button  onClick={() => navigate("/menu")} className="border-2 border-yellow-600 text-yellow-600 px-6 py-2 rounded-full text-lg font-semibold hover:bg-yellow-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
              View Menu
            </button>
          </div>
        </div>
      </section>
      <FeaturedCard/>
      <FoodShowcase/>
      <News/>
      <Footer/>
    </div>
  );
};

export default FoodifyRestaurant;