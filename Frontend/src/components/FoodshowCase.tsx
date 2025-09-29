import React from 'react';
import { Star } from 'lucide-react';

interface Guest {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
}



const FoodShowcase: React.FC = () => {
  // Sample guest reviews data
  const guests: Guest[] = [
    {
      id: 1,
      name: "Michael S. Berlin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      rating: 5,
      review: "Amazing! The food and the service was amazing. I had steak and eggs it was the best steak I've ever had.",
      date: "2 days ago"
    },
    {
      id: 2,
      name: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      rating: 5,
      review: "The flavors were incredible. You can taste everything in each and every bite and seasoning - really fantastic.",
      date: "1 week ago"
    },
    {
      id: 3,
      name: "Sarah Edwards",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      rating: 5,
      review: "From table to kitchen, every step was perfect. The dishes are locally sourced and fresh in taste.",
      date: "2 weeks ago"
    },
    {
      id: 4,
      name: "Anna Miller",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
      rating: 5,
      review: "Incredible meals with wonderful presentation. The atmosphere was perfect for a special dining experience.",
      date: "3 weeks ago"
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
          <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-teal-500 uppercase tracking-wider font-medium mb-4">
                  QUALITY & BALANCE
                </p>
                <h2 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
                  Our Food Philosophy
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  Simple and balanced, Alexander Petillo brings together flavors 
                  and specialties from Italy and beyond to create his own culinary 
                  world, full of surprising artistry.
                </p>
                <button className="bg-yellow-600 hover:bg-yellow-800 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 cursor-pointer">
                  Read More
                </button>
              </div>
            </div>

            {/* Right Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Large top image */}
                <div className="col-span-2">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=300&fit=crop"
                    alt="Chef preparing dishes"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Bottom left image */}
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=300&h=250&fit=crop"
                    alt="Kitchen workspace"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Bottom right image */}
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=250&fit=crop"
                    alt="Plated dishes"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Guest Reviews Section */}
        <div className="text-center mb-12">
          <p className="text-sm text-teal-500 uppercase tracking-wider mb-4 font-medium">
            Guest testimonials
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-12">
            What Our Guests Are Saying
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guests.map((guest) => (
            <div key={guest.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              {/* Rating */}
              <div className="mb-4">
                {renderStars(guest.rating)}
              </div>
              
              {/* Review Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{guest.review}"
              </p>
              
              {/* Guest Info */}
              <div className="flex items-center gap-3">
                <img
                  src={guest.avatar}
                  alt={guest.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">
                    {guest.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {guest.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodShowcase;