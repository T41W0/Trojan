'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Search, MessageCircle, Phone, Mail, Clock, BookOpen, Video, FileText, Users, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface HelpArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  readTime: string;
  tags: string[];
}

const helpArticles: HelpArticle[] = [
  {
    id: 1,
    title: "How to Place Your First Order",
    content: "Learn how to browse restaurants, select dishes, and complete your first order on Tega's Food platform.",
    category: "Getting Started",
    readTime: "3 min read",
    tags: ["order", "first-time", "tutorial"]
  },
  {
    id: 2,
    title: "Understanding Delivery Fees",
    content: "Find out how delivery fees are calculated and ways to minimize your delivery costs.",
    category: "Delivery & Fees",
    readTime: "2 min read",
    tags: ["delivery", "fees", "pricing"]
  },
  {
    id: 3,
    title: "Tracking Your Order in Real-Time",
    content: "Learn how to track your order from preparation to delivery with our real-time tracking system.",
    category: "Order Tracking",
    readTime: "2 min read",
    tags: ["tracking", "real-time", "status"]
  },
  {
    id: 4,
    title: "Payment Methods and Security",
    content: "Information about accepted payment methods and how we keep your payment information secure.",
    category: "Payment",
    readTime: "4 min read",
    tags: ["payment", "security", "stripe"]
  },
  {
    id: 5,
    title: "Managing Your Account Settings",
    content: "Learn how to update your profile, delivery addresses, and notification preferences.",
    category: "Account Management",
    readTime: "3 min read",
    tags: ["account", "settings", "profile"]
  },
  {
    id: 6,
    title: "Canceling or Modifying Orders",
    content: "Step-by-step guide on how to cancel orders or request modifications before delivery.",
    category: "Order Management",
    readTime: "3 min read",
    tags: ["cancel", "modify", "order"]
  },
  {
    id: 7,
    title: "Nigerian Food Guide",
    content: "Discover popular Nigerian dishes, ingredients, and what to expect from our authentic cuisine.",
    category: "Food Guide",
    readTime: "5 min read",
    tags: ["nigerian", "food", "guide", "dishes"]
  },
  {
    id: 8,
    title: "Troubleshooting Common Issues",
    content: "Solutions to common problems like login issues, payment failures, and delivery problems.",
    category: "Troubleshooting",
    readTime: "4 min read",
    tags: ["troubleshoot", "issues", "problems"]
  }
];

const categories = ["All", "Getting Started", "Delivery & Fees", "Order Tracking", "Payment", "Account Management", "Order Management", "Food Guide", "Troubleshooting"];

const quickActions = [
  {
    title: "Place an Order",
    description: "Start ordering delicious Nigerian food",
    icon: BookOpen,
    href: "/restaurants",
    color: "gradient-nigerian"
  },
  {
    title: "Track Order",
    description: "Check your order status",
    icon: Clock,
    href: "/orders",
    color: "gradient-food"
  },
  {
    title: "Contact Support",
    description: "Get help from our team",
    icon: MessageCircle,
    href: "/contact",
    color: "gradient-cool"
  },
  {
    title: "View FAQ",
    description: "Find quick answers",
    icon: HelpCircle,
    href: "/faq",
    color: "gradient-warm"
  }
];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-gradient-nigerian sm:text-white">
                  Help Center
                </span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Get help and support for Tega's Food 🇳🇬
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

      {/* Quick Actions */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient-nigerian mb-2">
              Quick Actions
            </h2>
            <p className="text-gray-600">Get started with these common tasks</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 sm:bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md border border-nigerian-green/20 sm:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-gradient-nigerian group-hover:text-gradient-food transition-all duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-nigerian-green w-5 h-5" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-2xl sm:rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-nigerian text-white shadow-lg'
                    : 'bg-food-coconut/50 text-gray-700 hover:bg-gradient-warm hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Help Articles */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-gradient-nigerian opacity-20 rounded-full animate-pulse"></div>
                <HelpCircle className="absolute inset-0 m-auto w-16 h-16 text-nigerian-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-gradient-food">
                No Articles Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md border border-nigerian-green/20 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-nigerian-green/10 text-nigerian-green rounded-full">
                            {article.category}
                          </span>
                          <span className="text-sm text-gray-500">{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 text-gradient-nigerian hover:text-gradient-food transition-all duration-300 cursor-pointer">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {article.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-food-coconut/30 text-gray-600 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        <button className="w-10 h-10 bg-gradient-nigerian rounded-full flex items-center justify-center text-white hover:bg-gradient-food transition-all duration-300">
                          <FileText className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-food-plantain/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-8 border border-nigerian-green/20">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-cool rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-gradient-nigerian">
                Still Need Help?
              </h2>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg">
              Our support team is ready to assist you with any questions or issues! 🇳🇬
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <Phone className="w-8 h-8 text-nigerian-green mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Call Support</h3>
                <p className="text-sm text-gray-600">+44 20 7123 4567</p>
                <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-9PM</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <Mail className="w-8 h-8 text-nigerian-green mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600">support@tegasfood.com</p>
                <p className="text-xs text-gray-500 mt-1">24/7 Response</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <MessageCircle className="w-8 h-8 text-nigerian-green mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-xs text-gray-500 mt-1">Instant Help</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-nigerian text-white font-bold rounded-2xl sm:rounded-lg hover:bg-gradient-food transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 sm:hover:translate-y-0"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
