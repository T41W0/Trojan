'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ChefHat, Truck, MapPin, Play, Pause, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_name: string;
  delivery_address: string;
}

export default function OrderSimulatorPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [isProgressing, setIsProgressing] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/admin');
      return;
    }
    fetchRecentOrders();
  }, [user, isAdmin, router]);

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Order ${orderId} status updated to ${status}`);
        fetchRecentOrders(); // Refresh orders
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const startOrderProgression = async (orderId: string) => {
    setIsProgressing(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delay: 5000 }), // 5 seconds between updates
      });

      if (response.ok) {
        toast.success(`Order ${orderId} progression started!`);
      } else {
        toast.error('Failed to start order progression');
      }
    } catch (error) {
      console.error('Error starting progression:', error);
      toast.error('Failed to start order progression');
    } finally {
      setIsProgressing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'preparing': return <ChefHat className="w-4 h-4 text-orange-600" />;
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4 text-purple-600" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Orders</h1>
            <p className="text-gray-600">Please wait while we fetch recent orders...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Status Simulator</h1>
          <p className="text-gray-600 mt-2">
            Simulate order status updates for testing the tracking system
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">How to Test Order Tracking</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. <strong>Place an Order:</strong> Go to the restaurant, add items to cart, and complete checkout</p>
            <p>2. <strong>Copy Order ID:</strong> Note the order ID from the confirmation page</p>
            <p>3. <strong>Update Status:</strong> Use this page to manually update order status or start auto-progression</p>
            <p>4. <strong>Track Order:</strong> Go to <a href="/track-order" className="underline font-medium">Track Order</a> page and enter the order ID</p>
            <p>5. <strong>Watch Updates:</strong> See real-time status updates in the tracking page</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-600">Click on an order to manage its status</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No orders found. Place an order first to test tracking.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedOrder === order.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{order.delivery_address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        £{order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startOrderProgression(order.id);
                            }}
                            disabled={isProgressing}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Start auto-progression"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Status Updates */}
        {selectedOrder && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Manual Status Updates - Order #{selectedOrder}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(selectedOrder, status)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    orders.find(o => o.id === selectedOrder)?.status === status
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    {getStatusIcon(status)}
                    <span className="text-xs font-medium capitalize">
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => startOrderProgression(selectedOrder)}
                disabled={isProgressing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isProgressing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>Start Auto-Progression (5s intervals)</span>
              </button>
            </div>
          </div>
        )}

        {/* Test Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Testing Instructions</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <p><strong>Quick Test:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Place an order and note the order ID</li>
              <li>Come back to this page and select the order</li>
              <li>Click "Start Auto-Progression" to simulate the full order journey</li>
              <li>Open the <a href="/track-order" className="underline font-medium">Track Order</a> page in another tab</li>
              <li>Enter the order ID and watch real-time updates</li>
            </ol>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
