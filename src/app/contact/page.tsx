'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Star, Users, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-food-coconut to-food-plantain/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 bg-gradient-nigerian opacity-10 sm:opacity-0"></div>
        
        <div className="relative gradient-bg text-white py-12 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Mobile-only animated elements */}
            <div className="sm:hidden mb-6">
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-gradient-nigerian sm:text-white">
                  Contact Us
                </span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Get in touch with Tega's Food team 🇳🇬
            </p>
            
            <Link
              href="/"
              className="inline-flex items-center text-white hover:text-nigerian-gold transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 sm:bg-transparent sm:px-0 sm:py-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md border border-nigerian-green/20">
              <div className="w-16 h-16 bg-gradient-nigerian rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-gradient-nigerian">
                Phone
              </h3>
              <p className="text-gray-600 mb-1">+44 20 7123 4567</p>
              <p className="text-sm text-gray-500">Mon-Fri 9AM-9PM</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md border border-nigerian-green/20">
              <div className="w-16 h-16 bg-gradient-food rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-gradient-food">
                Email
              </h3>
              <p className="text-gray-600 mb-1">support@tegasfood.com</p>
              <p className="text-sm text-gray-500">24/7 Support</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md border border-nigerian-green/20">
              <div className="w-16 h-16 bg-gradient-cool rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-gradient-nigerian">
                Address
              </h3>
              <p className="text-gray-600 mb-1">London, UK</p>
              <p className="text-sm text-gray-500">Headquarters</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md border border-nigerian-green/20">
              <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-gradient-warm">
                Live Chat
              </h3>
              <p className="text-gray-600 mb-1">Available Now</p>
              <p className="text-sm text-gray-500">Instant Help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Additional Info */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-8 border border-nigerian-green/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-nigerian rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gradient-nigerian">
                  Send us a Message
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                      placeholder="+44 20 1234 5678"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="business">Business Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                    placeholder="Brief subject of your message"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-nigerian text-white py-4 px-6 rounded-2xl sm:rounded-lg font-bold hover:bg-gradient-food disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-6 border border-nigerian-green/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-nigerian-green" />
                  <h3 className="text-xl font-bold text-gradient-nigerian">Business Hours</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 6:00 PM</span>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 rounded-lg border border-nigerian-green/20">
                    <p className="text-sm text-gray-600">
                      <strong>Emergency Support:</strong> Available 24/7 for urgent order issues
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-6 border border-nigerian-green/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="w-6 h-6 text-nigerian-green" />
                  <h3 className="text-xl font-bold text-gradient-nigerian">Why Choose Tega's Food?</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-nigerian rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🇳🇬</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Authentic Nigerian Cuisine</h4>
                      <p className="text-sm text-gray-600">Traditional recipes from experienced Nigerian chefs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-food rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fast Delivery</h4>
                      <p className="text-sm text-gray-600">Quick and reliable delivery across London</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-cool rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">💎</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                      <p className="text-sm text-gray-600">Partnered with top-rated Nigerian restaurants</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-6 border border-nigerian-green/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-nigerian-green" />
                  <h3 className="text-xl font-bold text-gradient-nigerian">Quick Links</h3>
                </div>
                <div className="space-y-2">
                  <Link href="/faq" className="block text-nigerian-green hover:text-food-jollof transition-colors duration-300">
                    Frequently Asked Questions
                  </Link>
                  <Link href="/help" className="block text-nigerian-green hover:text-food-jollof transition-colors duration-300">
                    Help Center
                  </Link>
                  <Link href="/privacy" className="block text-nigerian-green hover:text-food-jollof transition-colors duration-300">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block text-nigerian-green hover:text-food-jollof transition-colors duration-300">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
