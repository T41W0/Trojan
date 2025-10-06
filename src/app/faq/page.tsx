'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Ordering & Delivery
  {
    id: 1,
    question: "How do I place an order?",
    answer: "Simply browse our restaurants, select your favorite Nigerian dishes, add them to your cart, and proceed to checkout. You can pay securely with your card and track your order in real-time.",
    category: "Ordering & Delivery"
  },
  {
    id: 2,
    question: "What is the minimum order amount?",
    answer: "There is no minimum order amount at Tega's Food. Order as little or as much as you like! However, delivery fees apply based on distance.",
    category: "Ordering & Delivery"
  },
  {
    id: 3,
    question: "How long does delivery take?",
    answer: "Delivery typically takes 30-45 minutes from the time your order is confirmed. You'll receive real-time updates on your order status including preparation and delivery tracking.",
    category: "Ordering & Delivery"
  },
  {
    id: 4,
    question: "Do you deliver to my area?",
    answer: "We deliver across London and surrounding areas. Enter your address during checkout to check delivery availability in your area.",
    category: "Ordering & Delivery"
  },
  
  // Payment & Pricing
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express). All payments are processed securely through Stripe.",
    category: "Payment & Pricing"
  },
  {
    id: 6,
    question: "How is the delivery fee calculated?",
    answer: "Delivery fees are calculated based on the distance from the restaurant to your location. The fee is £2.50 per kilometer, with a minimum delivery fee of £5.",
    category: "Payment & Pricing"
  },
  {
    id: 7,
    question: "Are there any hidden fees?",
    answer: "No hidden fees! You'll see the exact total including food prices, delivery fee, and any applicable taxes before you confirm your order.",
    category: "Payment & Pricing"
  },
  
  // Account & Profile
  {
    id: 8,
    question: "How do I create an account?",
    answer: "Click 'Sign Up' in the top right corner, enter your details, and verify your email. You can also use our demo accounts to test the platform.",
    category: "Account & Profile"
  },
  {
    id: 9,
    question: "Can I save my favorite dishes?",
    answer: "Yes! Once you're logged in, you can save your favorite restaurants and dishes for quick reordering. Your order history is also saved for easy reference.",
    category: "Account & Profile"
  },
  {
    id: 10,
    question: "How do I update my delivery address?",
    answer: "Go to your profile settings and update your default address. You can also enter a different address for each order during checkout.",
    category: "Account & Profile"
  },
  
  // Nigerian Food & Menu
  {
    id: 11,
    question: "What Nigerian dishes do you offer?",
    answer: "We offer a wide variety of authentic Nigerian dishes including Jollof Rice, Pounded Yam with Egusi, Pepper Soup, Suya, Akara, Plantain, and many more traditional favorites.",
    category: "Nigerian Food & Menu"
  },
  {
    id: 12,
    question: "Are the ingredients fresh and authentic?",
    answer: "Absolutely! We work with local Nigerian restaurants that use fresh, authentic ingredients to prepare traditional dishes just like you'd find in Nigeria.",
    category: "Nigerian Food & Menu"
  },
  {
    id: 13,
    question: "Can I customize my order?",
    answer: "Yes! Most dishes can be customized with special instructions. You can specify spice levels, remove ingredients, or add extra items when placing your order.",
    category: "Nigerian Food & Menu"
  },
  
  // Support & Issues
  {
    id: 14,
    question: "What if I have an issue with my order?",
    answer: "Contact our support team immediately through the Help Center or call us directly. We'll resolve any issues with your order quickly and fairly.",
    category: "Support & Issues"
  },
  {
    id: 15,
    question: "Can I cancel my order?",
    answer: "You can cancel your order within 5 minutes of placing it. After that, the restaurant may have already started preparation. Contact support for assistance.",
    category: "Support & Issues"
  },
  {
    id: 16,
    question: "What if my food arrives cold or incorrect?",
    answer: "We guarantee food quality and accuracy. If there's an issue, contact us immediately and we'll provide a full refund or replacement order.",
    category: "Support & Issues"
  }
];

const categories = ["All", "Ordering & Delivery", "Payment & Pricing", "Account & Profile", "Nigerian Food & Menu", "Support & Issues"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
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
                  Frequently Asked Questions
                </span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Find answers to common questions about Tega's Food 🇳🇬
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

      {/* Search and Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent bg-gradient-to-r from-white to-food-coconut/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
              />
              <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-nigerian-green w-5 h-5" />
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

      {/* FAQ Items */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-gradient-nigerian opacity-20 rounded-full animate-pulse"></div>
                <HelpCircle className="absolute inset-0 m-auto w-16 h-16 text-nigerian-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-gradient-food">
                No FAQs Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md border border-nigerian-green/20 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-food-coconut/30 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-nigerian-green/10 text-nigerian-green rounded-full">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 text-gradient-nigerian">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    {openItems.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-nigerian-green flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-nigerian-green flex-shrink-0" />
                    )}
                  </button>
                  
                  {openItems.includes(faq.id) && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
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
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-gradient-nigerian">
                Still Need Help?
              </h2>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg">
              Can't find what you're looking for? Our support team is here to help! 🇳🇬
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <Phone className="w-8 h-8 text-nigerian-green mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-sm text-gray-600">+44 20 7123 4567</p>
                <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-9PM</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <Mail className="w-8 h-8 text-nigerian-green mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-sm text-gray-600">support@tegasfood.com</p>
                <p className="text-xs text-gray-500 mt-1">24/7 Support</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-food-coconut to-food-plantain/20 rounded-2xl sm:rounded-lg border border-nigerian-green/20">
                <Clock className="w-8 h-8 text-nigerian-green mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-xs text-gray-500 mt-1">Instant Help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
