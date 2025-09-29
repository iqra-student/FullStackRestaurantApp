
import { Facebook, Twitter, Instagram, Youtube, ChefHat } from 'lucide-react';



const Footer: React.FC = () => {



  return (
    <div className=" bg-gray-50">
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-600 p-2 rounded">
                  <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                    <div className="p-2 bg-yellow-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
                      <ChefHat className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-xl font-light">Foodify</h4>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">FINE FOOD &</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                For a truly memorable dining experience reserve in advance a table
                as soon as you can. Come and taste our remarkable food and wine.
              </p>
            </div>

            {/* Open Hours */}
            <div>
              <h5 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
                OPEN HOURS
              </h5>
              <div className="space-y-3 text-sm text-gray-400">
                <div>
                  <p className="text-white">Monday - Sunday</p>
                </div>
                <div>
                  <p>Lunch: 12 PM - PM</p>
                </div>
                <div>
                  <p>Dinner: 6 PM - 10 PM</p>
                </div>
                <div>
                  <p>Happy Hours: 4 PM - 7 PM</p>
                </div>
              </div>
            </div>

            {/* More Info */}
            <div>
              <h5 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
                MORE INFO
              </h5>
              <div className="space-y-3 text-sm text-gray-400">
                <div>
                  <a href="#" className="hover:text-white transition-colors">Careers</a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">Get in Touch</a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">Latest News</a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">Contact Now</a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h5 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
                ADDRESS
              </h5>
              <div className="space-y-3 text-sm text-gray-400">
                <div>
                  <p>58 Ralph Ave</p>
                  <p>Pakistan, Islamabad 1111</p>
                </div>
                <div>
                  <p>P: +1 800 000 111</p>
                  <p>E: sarkaria2074@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Travel By Scripttaudio. All Rights Reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;