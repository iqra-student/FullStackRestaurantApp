import { Send } from 'lucide-react';
import React, { useState } from 'react'

type Props = {}

const News = (props: Props) => {

  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };
  return (
    <>
      <section className="py-16 px-4">
        
        <div className="max-w-3xl mx-auto font-light text-center mb-12">
          <p className="text-sm text-teal-500 uppercase tracking-wider font-medium mb-4">
          QUALITY & BALANCE
        </p>
          <h2 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
            Our Newsletter
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            Stay updated with our latest news, offers, and delicious recipes.
            Subscribe today!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Image */}
              <div className="h-80 lg:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=400&fit=crop"
                  alt="Fine dining dish"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Content */}
              <div className="bg-yellow-600 p-12 flex flex-col justify-center">
                <h3 className="text-3xl lg:text-4xl font-light text-white mb-4">
                  Subscribe to Our <br /> Newsletter
                </h3>
                <p className="text-white/90 mb-8 leading-relaxed">
                  It is a long established fact that a reader will be
                  distracted by the readable content.
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email"
                      className="w-full px-6 py-4 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    />
                    <button
                      onClick={handleEmailSubmit}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-orange-400 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default News