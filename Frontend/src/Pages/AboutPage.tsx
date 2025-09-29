import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import News from "../components/News";
import Footer from "../components/Footer";

const AboutUs: React.FC = () => {
  return (
    <section className="min-h-screen bg-gray-50">
      <Header ismenuOpen={false} setIsMenuOpen={() => { }} />

      {/* Hero Section */}
      <div className="relative text-black min-h-screen flex flex-col justify-center px-6 md:px-20 py-16">
        {/* <div className="p-10 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-md max-w-6xl mx-auto">
         
        </div> */}
        {/* Main Content Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Text */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Determined to Take Care of You
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              We believe that food is more than just nourishment - it's a way every day to get together and experience something wonderful. We care about ingredients and make lasting memories. That's why every dish at Fodige is created to celebrate life's most meaningful moments.
            </p>

            <button  className="bg-yellow-600 text-black px-8 py-3 font-semibold rounded-full shadow-lg hover:bg-yellow-700 transition-colors duration-300 flex items-center gap-2">
              <Link to="/menu" className="font-semibold">View Menu</Link>
              <span className="bg-white text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                →
              </span>
            </button>
          </div>

          {/* Right - Food Image */}
         <div className="relative w-full max-w-2xl h-96">
        {/* Back Left Card */}
        <div className="absolute top-8 left-0 w-64 h-72 transform -rotate-12 transition-transform hover:rotate-0 hover:scale-105 duration-300 ease-in-out">
          <img
            src="https://images.immediate.co.uk/production/volatile/sites/30/2024/12/Chicken-Karahi-847828f.jpg"
            alt="Chinese Noodles"
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
        </div>

        {/* Center Main Card */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-80 z-10 transition-transform hover:scale-110 duration-300 ease-in-out">
          <img
            src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            alt="Delicious Chinese Food with Chopsticks"
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
        </div>

        {/* Back Right Card */}
        <div className="absolute top-8 right-0 w-64 h-72 transform rotate-12 transition-transform hover:rotate-0 hover:scale-105 duration-300 ease-in-out">
          <img
            src="https://cookwithnoorain.com/wp-content/uploads/2024/06/IMG_2487-scaled.jpg"
            alt="Asian Cuisine Spread"
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 left-20 w-4 h-4 bg-yellow-600 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-4 right-20 w-3 h-3 bg-yellow-600 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 -left-4 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
      </div>
        </div>
      </div>

      {/* Mission Section */}
      <div
        className="relative text-white py-20 px-6 md:px-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')"
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Our mission to delight<br />every bite!
          </h2>

          {/* Mission Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Farm to Table Process"
                  className="w-full h-32 object-cover rounded-2xl mb-4"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="bg-yellow-600 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  01
                </div>
                <h3 className="text-xl font-semibold">Farm-to-Table Process</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Community Food Collaborations"
                  className="w-full h-32 object-cover rounded-2xl mb-4"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="bg-yellow-600 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  02
                </div>
                <h3 className="text-xl font-semibold">Community Food </h3>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Seasonal Menu Innovations"
                  className="w-full h-32 object-cover rounded-2xl mb-4"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="bg-yellow-600 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  03
                </div>
                <h3 className="text-xl font-semibold">Seasonal Menu </h3>
              </div>
            </div>

            {/* Card 4 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Culinary Creativity"
                  className="w-full h-32 object-cover rounded-2xl mb-4"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="bg-yellow-600 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  04
                </div>
                <h3 className="text-xl font-semibold">Culinary Creativity</h3>
              </div>
            </div>
          </div>

        </div>
      </div>
<News/>
    <Footer/>
    </section>
  );
};

export default AboutUs;