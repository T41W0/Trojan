'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrdersPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber || !email) {
      return;
    }

    setLoading(true);
    router.push(`/orders/track?order_number=${orderNumber}&email=${email}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600">
            Enter your order details to see real-time delivery status
          </p>
        </div>

        {/* Track Order Form */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., TF-ABC123XYZ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !orderNumber || !email}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">
              See exactly where your order is and when it will arrive
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Updates</h3>
            <p className="text-gray-600">
              Get instant notifications when your order status changes
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Lookup</h3>
            <p className="text-gray-600">
              Simply enter your order number and email to get started
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find your order or having trouble tracking?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              View FAQ
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
