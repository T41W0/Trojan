 'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Clock, Truck, MapPin } from 'lucide-react';
import { Restaurant } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Fetch restaurants immediately
    fetchRestaurants();
    
    // Try to get user location for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location obtained:', position.coords.latitude, position.coords.longitude);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('📍 Location not available, using default London coordinates');
          setUserLocation({ lat: 51.5074, lng: -0.1278 });
        }
      );
    } else {
      console.log('📍 Geolocation not supported, using default London coordinates');
      setUserLocation({ lat: 51.5074, lng: -0.1278 });
    }
  }, []);

  const fetchRestaurants = async () => {
    try {
      console.log('🔍 fetchRestaurants called');
      setLoading(true);
      
      // Build params with location if available, otherwise fetch all restaurants
      const params = new URLSearchParams();
      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lng', userLocation.lng.toString());
        params.append('radius', '20'); // Larger radius for restaurant listing
      }
      
      console.log('📡 Fetching restaurants with params:', params.toString());
      const response = await fetch(`/api/restaurants?${params}`);
      const data = await response.json();
      
      console.log('📊 API response:', data);
      
      if (data.success) {
        console.log('✅ Setting restaurants:', data.data.length);
        setRestaurants(data.data);
      } else {
        console.error('❌ API returned error:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Since we only have Tega's Restaurant, no filtering needed
  const filteredRestaurants = restaurants;


  const formatRating = (rating: number | string | null) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return numRating && !isNaN(numRating) ? numRating.toFixed(1) : '0.0';
  };

  const formatDistance = (distance: number | null) => {
    return distance && !isNaN(distance) ? distance.toFixed(1) : '0.0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-food-coconut to-food-plantain/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 bg-gradient-nigerian opacity-10 sm:opacity-0"></div>
        
        <div className="relative bg-white sm:bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-gradient-nigerian sm:text-gray-900">
                  Tega's Restaurant
                </h1>
                {/* Mobile-only decorative line */}
                <div className="mt-2 sm:hidden">
                  <span className="inline-block w-16 h-1 bg-gradient-nigerian rounded-full"></span>
                </div>
              </div>
              <p className="text-lg sm:text-xl text-gray-600">
                Authentic Nigerian cuisine delivered fresh to your door 🇳🇬
              </p>
              
              {/* Mobile-only animated elements */}
              <div className="sm:hidden mt-4 space-y-2">
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-nigerian-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-nigerian-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-food-jollof rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Location Info */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-8">
            <MapPin className="w-4 h-4" />
            <span>
              {userLocation 
                ? "Tega's Restaurant - Distance calculated from your location" 
                : "Tega's Restaurant - Serving authentic Nigerian cuisine"
              }
            </span>
          </div>
        </div>
      </section>

      {/* Tega's Restaurant */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-6 animate-pulse border border-nigerian-green/20">
                  <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl sm:rounded-lg mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="food-card bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:translate-y-0 border border-nigerian-green/20 sm:border-gray-200 group"
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
                      <div className="w-full h-full bg-gradient-food flex items-center justify-center">
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
                    {restaurant.distance && restaurant.distance > 0 && (
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm shadow-md">
                        {formatDistance(restaurant.distance)} km
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-gradient-food sm:text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1 bg-food-plantain/20 rounded-full px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-food-jollof" />
                        <span className="font-medium">{restaurant.preparation_time} min</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-nigerian-green/20 rounded-full px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                        <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-nigerian-green" />
                        <span className="font-medium">£{restaurant.delivery_fee_per_km}/km</span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                      <p className="truncate flex items-center space-x-1">
                        <span className="sm:hidden">📍</span>
                        <span>{restaurant.address}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🍽️</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tega's Restaurant is loading
              </h3>
              <p className="text-gray-600 mb-4">
                We're preparing our delicious Nigerian menu for you! Please wait a moment. 🇳🇬
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
