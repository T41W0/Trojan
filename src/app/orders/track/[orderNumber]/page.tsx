'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MessageCircle, Copy } from 'lucide-react';
import RealtimeOrderTracking from '@/components/RealtimeOrderTracking';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  restaurant: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  estimated_delivery_time: string;
  delivery_address: string;
  created_at: string;
}

export default function OrderTrackingByNumberPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      console.log('🔍 Fetching order details for order number:', orderNumber);
      const response = await fetch(`/api/orders/track/${encodeURIComponent(orderNumber)}`);
      const data = await response.json();
      
      console.log('📊 Order API Response:', data);
      
      if (data.success) {
        console.log('✅ Order loaded successfully:', data.data);
        setOrder(data.data);
      } else {
        console.log('❌ Order not found:', data.error);
        toast.error('Order not found. Please check your order number.');
        router.push('/track-order');
      }
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      toast.error('Failed to load order details');
      router.push('/track-order');
    } finally {
      setLoading(false);
    }
  };

  const handleCallRestaurant = () => {
    if (order?.restaurant.phone) {
      window.open(`tel:${order.restaurant.phone}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <Link
              href="/track-order"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Another Order Number
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/track-order"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Track Order</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
        </div>

        {/* Order Number Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-lg font-medium text-blue-800 mb-2">Your Order Number</h2>
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="text-2xl font-bold text-blue-900 font-mono">{order.order_number}</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.order_number);
                toast.success('Order number copied to clipboard!');
              }}
              className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              title="Copy Order Number"
            >
              <Copy className="w-5 h-5 text-blue-600" />
            </button>
          </div>
          <p className="text-sm text-blue-600">
            Keep this number safe - you'll need it to track your order
          </p>
        </div>

        {/* Real-time Order Tracking */}
        <div className="mb-8">
          <RealtimeOrderTracking
            orderId={order.id}
            initialOrder={order}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleCallRestaurant}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Restaurant
          </button>
          
          <button
            onClick={() => {
              // In a real app, this would open a chat or support system
              toast.success('Support chat would open here');
            }}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Support
          </button>
        </div>

        {/* Order History */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Order Number:</span> {order.order_number}</p>
                <p><span className="font-medium">Status:</span> <span className="capitalize">{order.status.replace('_', ' ')}</span></p>
                <p><span className="font-medium">Placed:</span> {new Date(order.created_at).toLocaleString()}</p>
                <p><span className="font-medium">Total:</span> £{order.total_amount.toFixed(2)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Restaurant:</span> {order.restaurant.name}</p>
                <p><span className="font-medium">Delivery Address:</span> {order.delivery_address}</p>
                <p><span className="font-medium">Estimated Delivery:</span> {new Date(order.estimated_delivery_time).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
