'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, CheckCircle, Utensils, Truck, MapPin, Phone, Mail } from 'lucide-react';
import { formatDeliveryTime } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

interface OrderStatus {
  id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  estimated_delivery_time: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  restaurant_name: string;
  restaurant_address: string;
  restaurant_phone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: CheckCircle },
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing Food', icon: Utensils },
  { key: 'ready', label: 'Ready for Pickup', icon: CheckCircle },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number');
  const email = searchParams.get('email');
  
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumber && email) {
      fetchOrderStatus();
    } else {
      setError('Order number and email are required');
      setLoading(false);
    }
  }, [orderNumber, email]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?order_number=${orderNumber}&email=${email}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      setError('Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const getEstimatedDeliveryTime = () => {
    if (!order) return null;
    
    const estimatedTime = new Date(order.estimated_delivery_time);
    const now = new Date();
    const diffMinutes = Math.ceil((estimatedTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) return 'Delivered';
    return `${diffMinutes} minutes`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order status...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(order.total_amount)}
              </div>
              <div className="text-sm text-gray-500">
                {order.payment_status === 'paid' ? 'Payment Confirmed' : 'Payment Pending'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Progress</h2>
              
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.key} className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-orange-600 text-white' 
                          : isCurrent 
                            ? 'bg-orange-100 text-orange-600 border-2 border-orange-600'
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </div>
                        {isCurrent && (
                          <div className="text-sm text-orange-600">
                            {order.status === 'out_for_delivery' && getEstimatedDeliveryTime() && (
                              <>Expected in {getEstimatedDeliveryTime()}</>
                            )}
                            {order.status === 'preparing' && 'Food is being prepared'}
                            {order.status === 'confirmed' && 'Restaurant has confirmed your order'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {order.status === 'delivered' && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Order Delivered Successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your order was delivered at {new Date(order.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <span className="font-medium">{item.quantity}x {item.name}</span>
                    </div>
                    <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Info</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900">{order.restaurant_name}</div>
                  <div className="text-sm text-gray-600">{order.restaurant_address}</div>
                </div>
                {order.restaurant_phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{order.restaurant_phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Info</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Delivery Address</div>
                    <div className="text-sm text-gray-600">{order.delivery_address}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Estimated Delivery</div>
                    <div className="text-sm text-gray-600">
                      {order.status === 'delivered' 
                        ? 'Delivered'
                        : getEstimatedDeliveryTime() || 'Calculating...'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
