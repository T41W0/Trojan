'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { state: cartState } = useCart();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login successful!');
        router.push('/');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@tegasfood.com');
      setPassword('admin123');
    } else {
      setEmail('user@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-food-coconut to-food-plantain/20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
        <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-6 sm:p-8 border border-nigerian-green/20 relative overflow-hidden">
          {/* Mobile gradient background */}
          <div className="absolute inset-0 bg-gradient-nigerian opacity-5 sm:opacity-0"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-nigerian-green transition-all duration-300 mb-4 bg-food-coconut/50 hover:bg-food-coconut rounded-full px-3 py-2 sm:bg-transparent sm:px-0 sm:py-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-nigerian rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🍽️</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-gradient-nigerian">
                  Welcome Back
                </h1>
              </div>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Sign in to your account 🎉</p>
              
              {/* Mobile-only decorative elements */}
              <div className="sm:hidden mt-4 space-y-2">
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-nigerian-green/40 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-nigerian-gold/40 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-food-jollof/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>

            {/* Pending Cart Items Message */}
            {cartState.pendingItems.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="text-sm font-semibold text-orange-800">
                      Items waiting in your cart!
                    </h3>
                    <p className="text-xs text-orange-700 mt-1">
                      You have {cartState.pendingItems.length} item(s) waiting to be added to your cart. 
                      Sign in to add them automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nigerian-green w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nigerian-green w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nigerian-green hover:text-food-jollof transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-nigerian-green focus:ring-nigerian-green border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-nigerian-green hover:text-food-jollof transition-colors duration-300">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-nigerian text-white py-3 sm:py-4 px-4 rounded-2xl sm:rounded-lg font-bold hover:bg-gradient-food disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <span className="text-lg">🚀</span>
                  </span>
                )}
              </button>
          </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-nigerian-green hover:text-food-jollof font-semibold transition-colors duration-300">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
