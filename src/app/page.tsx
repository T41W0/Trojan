'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Clock, Truck, MapPin } from 'lucide-react';
import { Restaurant } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to NYC coordinates
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      // Default to NYC coordinates
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchRestaurants();
    }
  }, [userLocation]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: userLocation!.lat.toString(),
        lng: userLocation!.lng.toString(),
        radius: '10'
      });
      
      const response = await fetch(`/api/restaurants?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRestaurants(data.data);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-food-coconut to-food-plantain/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 bg-gradient-nigerian opacity-10 sm:opacity-0"></div>
        
        <div className="relative gradient-bg text-white py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Mobile-only animated elements */}
            <div className="sm:hidden mb-6">
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-gradient-nigerian sm:text-white">
                Delicious Food, Delivered Fast
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Order from your favorite restaurants and get it delivered to your doorstep 🍽️
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/restaurants"
                className="bg-white text-nigerian-green px-6 sm:px-8 py-3 sm:py-3 rounded-2xl sm:rounded-lg font-bold hover:bg-food-coconut transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 sm:hover:translate-y-0 w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Browse Restaurants</span>
                  <span className="text-lg">🍴</span>
                </span>
              </Link>
              <Link 
                href="/orders"
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-3 rounded-2xl sm:rounded-lg font-bold hover:bg-white hover:text-nigerian-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 sm:hover:translate-y-0 w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Track Order</span>
                  <span className="text-lg">📱</span>
                </span>
              </Link>
            </div>
            
            {/* Mobile-only decorative elements */}
            <div className="sm:hidden mt-8 space-y-2">
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-sm text-white/80">Amazing Nigerian dishes await you!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 bg-gradient-warm opacity-20 sm:opacity-0"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-nigerian rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⭐</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-gradient-food sm:text-gray-900">
                Why Choose Tega&apos;s Food?
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600">
              Fast, reliable, and delicious food delivery 🚀
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-gradient-to-br from-food-coconut to-food-plantain/20 sm:bg-white rounded-2xl sm:rounded-lg p-6 sm:p-8 shadow-lg sm:shadow-md border border-nigerian-green/20 sm:border-gray-200 card-nigerian">
              {/* Feature Image */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center" 
                  alt="Fast delivery motorcycle"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Icon overlay */}
              <div className="relative -mt-8 mb-6">
                <div className="w-12 h-12 bg-gradient-cool rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white">
                  <Truck className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-gradient-nigerian sm:text-gray-900">
                Fast Delivery
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Get your food delivered in 30-45 minutes with our efficient delivery network ⚡
              </p>
            </div>
            
            <div className="text-center bg-gradient-to-br from-food-coconut to-food-plantain/20 sm:bg-white rounded-2xl sm:rounded-lg p-6 sm:p-8 shadow-lg sm:shadow-md border border-nigerian-green/20 sm:border-gray-200 card-nigerian">
              {/* Feature Image */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center" 
                  alt="Quality restaurant kitchen"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Icon overlay */}
              <div className="relative -mt-8 mb-6">
                <div className="w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-gradient-food sm:text-gray-900">
                Quality Restaurants
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Partnered with the best restaurants in your area for the finest dining experience 🍽️
              </p>
            </div>
            
            <div className="text-center bg-gradient-to-br from-food-coconut to-food-plantain/20 sm:bg-white rounded-2xl sm:rounded-lg p-6 sm:p-8 shadow-lg sm:shadow-md border border-nigerian-green/20 sm:border-gray-200 card-nigerian">
              {/* Feature Image */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=center" 
                  alt="Map coverage area"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Icon overlay */}
              <div className="relative -mt-8 mb-6">
                <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-gradient-warm sm:text-gray-900">
                Wide Coverage
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                We deliver to neighborhoods across the city with real-time tracking 📍
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-orange-50/30 relative overflow-hidden">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 bg-gradient-nigerian opacity-10 sm:opacity-0"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-cool rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏪</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-gradient-nigerian sm:text-gray-900">
                Popular Restaurants
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600">
              Discover amazing food from local restaurants 🍽️
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-6 animate-pulse border border-orange-100 sm:border-gray-200">
                  <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl sm:rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/4"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.slice(0, 6).map((restaurant, index) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="food-card bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:translate-y-0 border border-orange-100 sm:border-gray-200 group"
                >
                  <div className="h-48 bg-gradient-food relative overflow-hidden">
                    {/* Mobile-only shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-food-shimmer sm:hidden"></div>
                    
                    {restaurant.image_url ? (
                      <img
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {restaurant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Mobile-only restaurant number badge */}
                    <div className="absolute top-2 left-2 sm:hidden">
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-nigerian-green rounded-full shadow-md animate-nigerian-pulse">
                        {index + 1}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-md">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent sm:text-gray-900">
                        {formatRating(restaurant.rating)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-gradient-food sm:text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center space-x-1 bg-food-plantain/20 rounded-full px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-food-jollof" />
                        <span className="font-medium">{restaurant.preparation_time} min</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-nigerian-green/20 rounded-full px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                        <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-nigerian-green" />
                        <span className="font-medium">£{restaurant.delivery_fee_per_km}/km</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/restaurants"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}