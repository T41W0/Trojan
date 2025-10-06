'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import toast from 'react-hot-toast';

interface PaymentData {
  order_id: string;
  client_secret: string;
  amount: number;
  currency: string;
}

interface RealtimePaymentProps {
  paymentData: PaymentData;
  onPaymentSuccess: (orderId: string) => void;
  onPaymentError: (error: string) => void;
}

type PaymentStatus = 'processing' | 'success' | 'failed' | 'pending';

export default function RealtimePayment({ 
  paymentData, 
  onPaymentSuccess, 
  onPaymentError 
}: RealtimePaymentProps) {
  const { socket, isConnected, joinOrder } = useSocket();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [processingStep, setProcessingStep] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    if (socket && paymentData.order_id) {
      joinOrder(paymentData.order_id);
      
      // Listen for payment updates
      socket.on('payment-update', (data) => {
        console.log('Payment update received:', data);
        handlePaymentUpdate(data);
      });

      socket.on('order-update', (data) => {
        console.log('Order update received:', data);
        if (data.status === 'confirmed') {
          setPaymentStatus('success');
          onPaymentSuccess(paymentData.order_id);
        }
      });

      return () => {
        socket.off('payment-update');
        socket.off('order-update');
      };
    }
  }, [socket, paymentData.order_id, joinOrder, onPaymentSuccess]);

  const handlePaymentUpdate = (data: any) => {
    switch (data.type) {
      case 'payment_processing':
        setPaymentStatus('processing');
        setProcessingStep(data.message || 'Processing payment...');
        break;
      case 'payment_success':
        setPaymentStatus('success');
        setProcessingStep('Payment successful!');
        toast.success('Payment completed successfully!');
        onPaymentSuccess(paymentData.order_id);
        break;
      case 'payment_failed':
        setPaymentStatus('failed');
        setProcessingStep(data.message || 'Payment failed');
        toast.error('Payment failed. Please try again.');
        onPaymentError(data.message || 'Payment failed');
        break;
    }
  };

  const handlePayment = async () => {
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
      toast.error('Please fill in all card details');
      return;
    }

    setPaymentStatus('processing');
    setProcessingStep('Validating card details...');

    try {
      // Simulate payment processing with real-time updates
      const steps = [
        'Validating card details...',
        'Checking available balance...',
        'Processing payment with bank...',
        'Confirming transaction...',
        'Payment successful!'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        
        // Emit real-time update to server
        if (socket) {
          socket.emit('payment-step', {
            order_id: paymentData.order_id,
            step: i + 1,
            total_steps: steps.length,
            message: steps[i]
          });
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (i === steps.length - 1) {
          setPaymentStatus('success');
          onPaymentSuccess(paymentData.order_id);
        }
      }
    } catch (error) {
      setPaymentStatus('failed');
      setProcessingStep('Payment failed');
      onPaymentError('Payment processing failed');
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Loader className="w-6 h-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'border-blue-500 bg-blue-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'failed':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center mb-6">
        {getStatusIcon()}
        <h2 className="text-xl font-semibold ml-2">Payment</h2>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Payment Amount */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900">
          £{paymentData.amount.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">
          Order #{paymentData.order_id}
        </div>
      </div>

      {/* Payment Form */}
      {paymentStatus === 'pending' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                cardNumber: formatCardNumber(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  expiryDate: formatExpiryDate(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  cvv: e.target.value.replace(/\D/g, '')
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardDetails.cardholderName}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                cardholderName: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Pay £{paymentData.amount.toFixed(2)}
          </button>
        </div>
      )}

      {/* Processing Status */}
      {paymentStatus === 'processing' && (
        <div className={`border-2 rounded-lg p-4 ${getStatusColor()}`}>
          <div className="flex items-center justify-center mb-2">
            <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
            <span className="font-medium">Processing Payment</span>
          </div>
          <p className="text-center text-sm">{processingStep}</p>
        </div>
      )}

      {/* Success Status */}
      {paymentStatus === 'success' && (
        <div className={`border-2 rounded-lg p-4 ${getStatusColor()}`}>
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="font-medium">Payment Successful!</span>
          </div>
          <p className="text-center text-sm">Your order has been confirmed and payment processed.</p>
        </div>
      )}

      {/* Failed Status */}
      {paymentStatus === 'failed' && (
        <div className={`border-2 rounded-lg p-4 ${getStatusColor()}`}>
          <div className="flex items-center justify-center mb-2">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="font-medium">Payment Failed</span>
          </div>
          <p className="text-center text-sm">{processingStep}</p>
          <button
            onClick={() => setPaymentStatus('pending')}
            className="w-full mt-3 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
