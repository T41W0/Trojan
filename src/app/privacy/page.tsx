'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-gradient-nigerian sm:text-white">
                  Privacy Policy
                </span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Your privacy matters to us at Tega's Food 🇳🇬
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
                <Eye className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Introduction</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Tega's Food! We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food delivery platform.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Information We Collect</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Name, email address, and phone number</li>
                    <li>• Delivery addresses and location data</li>
                    <li>• Payment information (processed securely through Stripe)</li>
                    <li>• Order history and preferences</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Information</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Device information and IP address</li>
                    <li>• Browser type and operating system</li>
                    <li>• Usage patterns and app interactions</li>
                    <li>• Location data (with your permission)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">How We Use Your Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-food-coconut/20 to-white p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Delivery</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• Process and fulfill your food orders</li>
                    <li>• Coordinate delivery to your location</li>
                    <li>• Provide customer support</li>
                    <li>• Send order confirmations and updates</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-food-coconut/20 to-white p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvement & Marketing</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• Improve our platform and services</li>
                    <li>• Personalize your experience</li>
                    <li>• Send promotional offers (with consent)</li>
                    <li>• Analyze usage patterns</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Information Sharing</h2>
              </div>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Restaurants:</strong> Order details for food preparation and delivery</li>
                  <li>• <strong>Payment Processors:</strong> Stripe for secure payment processing</li>
                  <li>• <strong>Delivery Partners:</strong> Contact information for order delivery</li>
                  <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-nigerian-green" />
                <h2 className="text-2xl font-bold text-gradient-nigerian">Data Security</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-food-coconut/20 to-white rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <Lock className="w-8 h-8 text-nigerian-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Encryption</h3>
                  <p className="text-sm text-gray-600">All data is encrypted in transit and at rest</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-food-coconut/20 to-white rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <Database className="w-8 h-8 text-nigerian-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Secure Storage</h3>
                  <p className="text-sm text-gray-600">Data stored in secure, monitored databases</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-food-coconut/20 to-white rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                  <Shield className="w-8 h-8 text-nigerian-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Access Control</h3>
                  <p className="text-sm text-gray-600">Limited access with strict authentication</p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Your Rights</h2>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600 mb-4">Under GDPR and UK data protection laws, you have the right to:</p>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                  <li>• <strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li>• <strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li>• <strong>Portability:</strong> Receive your data in a structured format</li>
                  <li>• <strong>Object:</strong> Object to processing of your data</li>
                  <li>• <strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Cookies and Tracking</h2>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li>• <strong>Marketing Cookies:</strong> Deliver relevant advertisements (with consent)</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Contact Us</h2>
              
              <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-nigerian-green" />
                    <span className="text-gray-700">privacy@tegasfood.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-nigerian-green" />
                    <span className="text-gray-700">+44 20 7123 4567</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Data Protection Officer: privacy@tegasfood.com
                </p>
              </div>
            </div>

            {/* Updates */}
            <div className="bg-gradient-to-r from-food-coconut/30 to-food-plantain/20 p-6 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
              <h2 className="text-2xl font-bold text-gradient-nigerian mb-4">Policy Updates</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
