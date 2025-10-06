'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ChefHat, Truck, MapPin, Phone } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

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

interface RealtimeOrderTrackingProps {
  orderId: string;
  initialOrder?: OrderData;
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

const statusSteps: { [key in OrderStatus]: { label: string; icon: React.ReactNode; color: string } } = {
  pending: { label: 'Order Placed', icon: <Clock className="w-5 h-5" />, color: 'text-yellow-600' },
  confirmed: { label: 'Order Confirmed', icon: <CheckCircle className="w-5 h-5" />, color: 'text-blue-600' },
  preparing: { label: 'Preparing Food', icon: <ChefHat className="w-5 h-5" />, color: 'text-orange-600' },
  ready: { label: 'Ready for Pickup', icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600' },
  out_for_delivery: { label: 'Out for Delivery', icon: <Truck className="w-5 h-5" />, color: 'text-purple-600' },
  delivered: { label: 'Delivered', icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600' },
  cancelled: { label: 'Cancelled', icon: <Clock className="w-5 h-5" />, color: 'text-red-600' }
};

export default function RealtimeOrderTracking({ orderId, initialOrder }: RealtimeOrderTrackingProps) {
  const { socket, isConnected, joinOrder } = useSocket();
  const [order, setOrder] = useState<OrderData | null>(initialOrder || null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    console.log('🔍 RealtimeOrderTracking: socket, orderId, initialOrder:', { socket: !!socket, orderId, initialOrder });
    if (socket && orderId) {
      console.log('🔗 Joining order:', orderId);
      joinOrder(orderId);
      
      // Listen for order updates
      socket.on('order-update', (data) => {
        console.log('📡 Order update received:', data);
        handleOrderUpdate(data);
      });

      // Listen for order status updates (from admin panel)
      socket.on('order-status-updated', (data) => {
        console.log('📡 Order status update received:', data);
        if (data.orderId === orderId) {
          handleOrderUpdate({ status: data.status, updatedAt: data.updatedAt });
        }
      });

      // Listen for delivery updates
      socket.on('delivery-update', (data) => {
        console.log('🚚 Delivery update received:', data);
        handleDeliveryUpdate(data);
      });

      return () => {
        socket.off('order-update');
        socket.off('order-status-updated');
        socket.off('delivery-update');
      };
    }
  }, [socket, orderId, joinOrder]);

  const handleOrderUpdate = (data: any) => {
    console.log('📡 Processing order update:', data);
    setOrder(prev => prev ? { ...prev, ...data } : data);
    if (data.status) {
      const oldStatus = currentStatus;
      setCurrentStatus(data.status);
      
      // Show notification for status changes
      if (oldStatus !== data.status) {
        const statusInfo = statusSteps[data.status as OrderStatus];
        if (statusInfo) {
          // Browser notification
          if (Notification.permission === 'granted') {
            new Notification(`Order Update - ${statusInfo.label}`, {
              body: `Your order #${orderId} status has been updated to: ${statusInfo.label}`,
              icon: '/favicon.ico'
            });
          }
          
          // Toast notification (will be handled by parent component)
          console.log(`🎉 Order status changed from ${oldStatus} to ${data.status}`);
        }
      }
    }
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const handleDeliveryUpdate = (data: any) => {
    if (data.estimated_time) {
      setEstimatedTime(data.estimated_time);
    }
    if (data.status) {
      setCurrentStatus(data.status);
    }
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const getStatusIndex = (status: OrderStatus): number => {
    const statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    return statuses.indexOf(status);
  };

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString();
    } catch {
      return timeString;
    }
  };

  if (!order) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Order</h3>
          <p className="text-gray-500">Please wait while we fetch your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-500">
            {isConnected ? 'Live Updates' : 'Offline'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdate}
        </p>
      </div>

      {/* Status Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          {Object.entries(statusSteps).map(([status, config], index) => {
            const isActive = getStatusIndex(currentStatus) >= index;
            const isCurrent = currentStatus === status;
            
            return (
              <div key={status} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <div className={isActive ? config.color : 'text-gray-400'}>
                    {config.icon}
                  </div>
                </div>
                <span className={`text-xs text-center ${
                  isActive ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {config.label}
                </span>
                {isCurrent && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-4">
        {/* Restaurant Info */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Restaurant</h3>
          <div className="text-sm text-gray-600">
            <p className="font-medium">{order.restaurant.name}</p>
            <div className="flex items-center mt-1">
              <Phone className="w-4 h-4 mr-1" />
              <span>{order.restaurant.phone}</span>
            </div>
            <div className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{order.restaurant.address}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>£{order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Delivery</h3>
          <div className="text-sm text-gray-600">
            <div className="flex items-center mb-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{order.delivery_address}</span>
            </div>
            {estimatedTime && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Estimated delivery: {formatTime(estimatedTime)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Status */}
        <div className="border-t pt-4">
          <div className={`flex items-center p-3 rounded-lg ${
            currentStatus === 'delivered' ? 'bg-green-50 border border-green-200' :
            currentStatus === 'cancelled' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className={statusSteps[currentStatus].color}>
              {statusSteps[currentStatus].icon}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">
                {statusSteps[currentStatus].label}
              </p>
              <p className="text-sm text-gray-500">
                {currentStatus === 'preparing' && 'Your food is being prepared with love'}
                {currentStatus === 'out_for_delivery' && 'Your order is on the way'}
                {currentStatus === 'delivered' && 'Enjoy your meal!'}
                {currentStatus === 'pending' && 'We have received your order'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
