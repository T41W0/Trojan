'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Clock, CheckCircle, Copy, Bell } from 'lucide-react';
import RealtimePayment from '@/components/RealtimePayment';
import RealtimeOrderTracking from '@/components/RealtimeOrderTracking';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { NotificationService } from '@/lib/notificationService';

interface OrderData {
  id: string;
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
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = searchParams.get('order_id');
  const clientSecret = searchParams.get('client_secret');
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      toast.error('No order ID provided');
      router.push('/cart');
    }
  }, [orderId, router]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      } else {
        toast.error('Order not found');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string) => {
    setPaymentCompleted(true);
    toast.success(`Payment completed! Order #${orderId} confirmed.`);
    
    // Request notification permission for order updates
    try {
      await NotificationService.requestNotificationPermission();
    } catch (error) {
      console.log('Notification permission request failed:', error);
    }
    
    // Clear the cart since the order has been successfully placed
    clearCart();
    
    // Redirect to order tracking after a longer delay to show success message
    setTimeout(() => {
      // Use the order number from the order data for more secure tracking
      router.push(`/orders/track/${order?.order_number || orderId}`);
    }, 4000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Checkout</h1>
            <p className="text-gray-600">Please wait while we prepare your payment...</p>
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
              href="/cart"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
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
      
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order Summary
                    </h2>
                    <div className="bg-blue-50 px-3 py-1 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">
                        Order #{order.id}
                      </span>
                    </div>
                  </div>
              
              {/* Restaurant Info */}
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium text-gray-900">{order.restaurant.name}</h3>
                <p className="text-sm text-gray-600">{order.restaurant.address}</p>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>£{order.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                <p className="text-sm text-gray-600">{order.delivery_address}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Estimated delivery: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Secure Payment
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            {!paymentCompleted ? (
              <RealtimePayment
                paymentData={{
                  order_id: orderId!,
                  client_secret: clientSecret || '',
                  amount: order.total_amount,
                  currency: 'gbp'
                }}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            ) : (
              /* Payment Success Screen */
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your order has been confirmed and payment processed.</p>
                
                {/* Order ID Display */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Your Order Tracking Number</h3>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="text-2xl font-bold text-blue-900 font-mono">#{orderId}</div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(orderId!);
                        toast.success('Order ID copied to clipboard!');
                      }}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      title="Copy Order ID"
                    >
                      <Copy className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Save this number to track your order</p>
                </div>
                
                {/* Important Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-yellow-800 mb-2">📱 What's Next?</h4>
                  <ul className="text-sm text-yellow-700 text-left space-y-1">
                    <li>• We'll send you updates via SMS/Email</li>
                    <li>• Track your order at any time</li>
                    <li>• Estimated delivery: {new Date(order.estimated_delivery_time).toLocaleTimeString()}</li>
                  </ul>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href={`/orders/track/${order?.order_number || orderId}`}
                    className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Track Your Order
                  </Link>
                  
                  <Link
                    href="/track-order"
                    className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Track Another Order
                  </Link>
                </div>
                
                {/* Redirect Notice */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Automatically redirecting to order tracking in a few seconds...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}