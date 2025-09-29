import React, { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission here
    };

    return (
        <>
            <Header ismenuOpen={false} setIsMenuOpen={() => { }} />
                  {/* Hero Section with Background Image */}
      <div className="relative h-80 bg-cover bg-center bg-gradient-to-r from-amber-900 to-amber-700">
        <div className="absolute inset-0 bg-[url('https://t4.ftcdn.net/jpg/03/57/91/11/360_F_357911175_lUNZj0iZx0B6UEj3JyJwhKnJQv1jT1i4.jpg')] bg-cover bg-center bg-black/40 bg-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
                Contact Us
            </h1>
            <p className="text-xl text-gray-200">
              Discover amazing flavors from around the world
            </p>
          </div>
        </div>
      </div>
            <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">

                    {/* Left Contact Us Section */}
                    <div className="md:w-2/5 bg-yellow-600 p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-white mb-8">Contact Us</h2>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-3">
                                <MapPin className="text-white mt-1 flex-shrink-0" size={20} />
                                <div className="text-white">
                                    <p className="text-sm">32, Princess st Newpark</p>
                                    <p className="text-sm">229594 Newpark</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail className="text-white flex-shrink-0" size={20} />
                                <p className="text-white text-sm">hello@yourcompany.com</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone className="text-white flex-shrink-0" size={20} />
                                <p className="text-white text-sm">+2358 1569 2563</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone className="text-white flex-shrink-0" size={20} />
                                <p className="text-white text-sm">+2358 1569 2700</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Get in Touch Section */}
                    <div
                        className="md:w-3/5 relative flex flex-col justify-center p-10"
                        style={{
                            backgroundImage: `url('https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg') `,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* White overlay for faded effect */}
                       
 
                        <div className="absolute inset-0 bg-black/40"></div>

                        {/* Form content */}
                        <div className="relative z-10">
                            <h2 className="text-2xl  font-bold text-white mb-2">Get in Touch</h2>
                            <p className="text-white mb-6">Feel free to drop us a line below!</p>

                            <div className="space-y-4 ">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border bg-white text-black  border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
                                />

                                <textarea
                                    name="message"
                                    placeholder="Type your message here..."
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border bg-white text-black border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                                ></textarea>

                                <button
                                    onClick={handleSubmit}
                                    className="bg-yellow-600 hover:bg-yellow-800 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out"
                                >
                                    SEND
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <Footer />
        </>
    );
};

export default ContactForm;