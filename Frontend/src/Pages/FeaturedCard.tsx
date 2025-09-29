import React from 'react';
import { ShoppingCart, Truck, Award } from 'lucide-react';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCards: React.FC = () => {
  const features: FeatureCard[] = [
    {
      icon: <ShoppingCart className="w-12 h-12 text-yellow-600" />,
      title: "Easy To Order",
      description: "Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua."
    },
    {
      icon: <Truck className="w-12 h-12 text-yellow-600" />,
      title: "Fastest Delivery",
      description: "Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua."
    },
    {
      icon: <Award className="w-12 h-12 text-yellow-600" />,
      title: "Best Quality",
      description: "Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="flex justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;