'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, Shield, CreditCard, Truck, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-gradient-nigerian sm:text-white">
                  Terms of Service
                </span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Terms and conditions for using Tega's Food 🇳🇬
            </p>
            
            <p className="text-sm sm:text-base opacity-75 mb-4">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
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

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-8 border border-nigerian-green/20">
            
            {/* Introduction */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Introduction</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Tega's Food! These Terms of Service ("Terms") govern your use of our food delivery platform and services. By accessing or using our platform, you agree to be bound by these Terms. Please read them carefully.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Acceptance of Terms</h2>
              </div>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600 mb-4">
                  By using our platform, you confirm that:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• You are at least 18 years old or have parental consent</li>
                  <li>• You have the legal capacity to enter into these Terms</li>
                  <li>• You will provide accurate and complete information</li>
                  <li>• You will use the platform in compliance with all applicable laws</li>
                </ul>
              </div>
            </div>

            {/* Service Description */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Truck className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Our Services</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Food Delivery Platform</h3>
                  <p className="text-gray-600">
                    Tega's Food connects customers with local Nigerian restaurants for food ordering and delivery. We facilitate transactions between customers and restaurants but are not responsible for food preparation or quality.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Availability</h3>
                  <p className="text-gray-600">
                    Our services are available in London and surrounding areas. Delivery times may vary based on location, restaurant preparation time, and traffic conditions. We strive to provide accurate delivery estimates but cannot guarantee exact times.
                  </p>
                </div>
              </div>
            </div>

            {/* User Accounts */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">User Accounts</h2>
              </div>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <ul className="text-gray-600 space-y-2">
                  <li>• You must create an account to place orders</li>
                  <li>• You are responsible for maintaining account security</li>
                  <li>• You must provide accurate and up-to-date information</li>
                  <li>• One account per person - multiple accounts are prohibited</li>
                  <li>• You must notify us immediately of any unauthorized access</li>
                </ul>
              </div>
            </div>

            {/* Orders and Payments */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Orders and Payments</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-food-coconut/20 to-white p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Process</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• Orders are processed immediately upon payment confirmation</li>
                    <li>• Restaurant preparation time varies by dish and restaurant</li>
                    <li>• Delivery time depends on distance and traffic conditions</li>
                    <li>• You can track your order status in real-time</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-food-coconut/20 to-white p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• All payments are processed securely through Stripe</li>
                    <li>• Prices include food cost, delivery fee, and applicable taxes</li>
                    <li>• Payment is required before order confirmation</li>
                    <li>• Refunds are processed according to our refund policy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cancellation and Refunds */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Cancellation and Refunds</h2>
              </div>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Cancellation</h3>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Orders can be cancelled within 5 minutes of placement</li>
                      <li>• After 5 minutes, cancellation depends on restaurant status</li>
                      <li>• Contact support for cancellation assistance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Policy</h3>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Full refund for cancelled orders before preparation</li>
                      <li>• Partial refund for orders with issues</li>
                      <li>• Refunds processed within 5-10 business days</li>
                      <li>• Contact support for refund requests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibited Uses */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Prohibited Uses</h2>
              </div>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600 mb-4">You may not use our platform to:</p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Violate any laws or regulations</li>
                  <li>• Submit false or misleading information</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Interfere with other users' enjoyment of the service</li>
                  <li>• Use the platform for commercial purposes without permission</li>
                  <li>• Harass, abuse, or harm other users or restaurant staff</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Limitation of Liability</h2>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600 mb-4">
                  Tega's Food acts as an intermediary between customers and restaurants. We are not responsible for:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Food quality, preparation, or safety</li>
                  <li>• Delivery delays due to traffic or weather</li>
                  <li>• Restaurant operational issues</li>
                  <li>• Personal injuries or property damage</li>
                  <li>• Indirect or consequential damages</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Our total liability is limited to the amount you paid for the specific order in question.
                </p>
              </div>
            </div>

            {/* Privacy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Privacy</h2>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600">
                  Your privacy is important to us. Our collection and use of personal information is governed by our 
                  <Link href="/privacy" className="text-nigerian-green hover:text-food-jollof font-semibold">
                    {' '}Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Changes to Terms</h2>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600">
                  We may modify these Terms at any time. We will notify users of significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Governing Law</h2>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600">
                  These Terms are governed by the laws of England and Wales. Any disputes will be resolved in the courts of England and Wales.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">Email:</span>
                  <span className="text-gray-600">legal@tegasfood.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">Phone:</span>
                  <span className="text-gray-600">+44 20 7123 4567</span>
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
