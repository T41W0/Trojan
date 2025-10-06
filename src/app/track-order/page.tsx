'use client';

import React, { useState } from 'react';
import { Search, Clock, MapPin, Phone, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RealtimeOrderTracking from '@/components/RealtimeOrderTracking';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [orderFound, setOrderFound] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      toast.error('Please enter your order number');
      return;
    }

    console.log('🔍 Tracking order number:', orderId.trim());
    setIsTracking(true);
    try {
      // Try tracking by order number first (more secure)
      const response = await fetch(`/api/orders/track/${encodeURIComponent(orderId.trim())}`);
      const data = await response.json();
      
      console.log('📊 API Response:', data);
      
      if (data.success) {
        console.log('✅ Order found, redirecting...');
        toast.success('Order found! Redirecting to tracking page...');
        // Redirect to the order details page using the order number
        setTimeout(() => {
          console.log('🚀 Redirecting to:', `/orders/track/${orderId.trim()}`);
          window.location.href = `/orders/track/${orderId.trim()}`;
        }, 1000);
      } else {
        console.log('❌ Order not found:', data.error);
        toast.error('Order not found. Please check your order number.');
        setOrderFound(false);
      }
    } catch (error) {
      console.error('❌ Error tracking order:', error);
      toast.error('Failed to load order details. Please try again.');
      setOrderFound(false);
    } finally {
      setIsTracking(false);
    }
  };

  const handleNewSearch = () => {
    setOrderFound(false);
    setOrderId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
        </div>

        {!orderFound ? (
          <div className="max-w-2xl mx-auto">
            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h2>
                <p className="text-gray-600">
                  Enter your order ID to get real-time updates on your delivery
                </p>
              </div>

              {/* Order ID Input */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter your order number (e.g., TF-ABC123-DEF456)"
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      disabled={isTracking}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Your order ID can be found in your order confirmation email or SMS
                  </p>
                </div>

                <button
                  onClick={handleTrackOrder}
                  disabled={isTracking || !orderId.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isTracking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Tracking Order...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Track Order
                    </>
                  )}
                </button>
              </div>

              {/* Recent Orders Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      If you recently placed an order, check your browser history or:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Check your email for order confirmation</li>
                      <li>• Look for SMS notifications</li>
                      <li>• Check your order history in your account</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Call Restaurant</h4>
                      <p className="text-sm text-gray-600">
                        Contact Tega's Restaurant directly for order updates
                      </p>
                      <a 
                        href="tel:+44XXXXXXXXXX" 
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        +44 XXXXXXXXXX
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Live Chat Support</h4>
                      <p className="text-sm text-gray-600">
                        Get instant help with your order
                      </p>
                      <button 
                        onClick={() => toast.success('Live chat would open here')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Start Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {/* This would typically show recent orders from localStorage or user account */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #TF-123456789</p>
                      <p className="text-sm text-gray-600">Placed 2 hours ago</p>
                    </div>
                    <button
                      onClick={() => {
                        setOrderId('TF-123456789');
                        handleTrackOrder();
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Track
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Sign in to see all your orders
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back to Search */}
            <div className="text-center">
              <button
                onClick={handleNewSearch}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Track Another Order
              </button>
            </div>

            {/* Order Tracking */}
            <RealtimeOrderTracking orderId={orderId} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
