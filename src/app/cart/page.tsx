'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { calculateDistance, calculateDeliveryFee, calculateDeliveryTime, formatCurrency, formatDeliveryTime, geocodeAddress, getCurrentLocation } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { user } = useAuth();
  const { 
    state: cartState, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getSubtotal 
  } = useCart();

  // Debug cart state
  console.log('Cart state:', cartState);
  console.log('Cart state keys:', Object.keys(cartState));
  console.log('Cart items length:', cartState.items?.length);
  console.log('Cart restaurant_id:', cartState.restaurant_id);
  
  // Check localStorage directly (only on client side)
  const [localStorageCart, setLocalStorageCart] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartKey = user ? `tegas-food-cart-${user.id}` : 'tegas-food-cart-guest';
      const cart = localStorage.getItem(cartKey);
      const parsedCart = cart ? JSON.parse(cart) : null;
      setLocalStorageCart(parsedCart);
      console.log(`LocalStorage cart for key ${cartKey}:`, parsedCart);
    }
  }, [user?.id]);
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    distance: number;
    deliveryFee: number;
    estimatedTime: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [addressInputValue, setAddressInputValue] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [countryCode, setCountryCode] = useState('+44');

  useEffect(() => {
    // Get user location and automatically fill delivery address
    const loadUserLocation = async () => {
      setIsLoadingLocation(true);
      try {
        const locationData = await getCurrentLocation();
        if (locationData) {
          setUserLocation({ lat: locationData.lat, lng: locationData.lng });
          setDeliveryAddress(locationData.address);
          setAddressInputValue(locationData.address);
          setDeliveryCoordinates({ lat: locationData.lat, lng: locationData.lng });
          toast.success('Location detected and address filled automatically!');
        } else {
          // Default to London coordinates for UK users
          setUserLocation({ lat: 51.5074, lng: -0.1278 });
          setDeliveryAddress('London, UK');
          setAddressInputValue('London, UK');
          setDeliveryCoordinates({ lat: 51.5074, lng: -0.1278 });
        }
      } catch (error) {
        console.error('Error getting location:', error);
        // Default to London coordinates for UK users
        setUserLocation({ lat: 51.5074, lng: -0.1278 });
        setDeliveryAddress('London, UK');
        setAddressInputValue('London, UK');
        setDeliveryCoordinates({ lat: 51.5074, lng: -0.1278 });
      } finally {
        setIsLoadingLocation(false);
      }
    };

    loadUserLocation();
  }, []);

  // Fetch restaurant data when restaurant_id changes
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (cartState.restaurant_id) {
        try {
          const response = await fetch(`/api/restaurants/${cartState.restaurant_id}`);
          const data = await response.json();
          if (data.success) {
            setRestaurantData(data.data);
          }
        } catch (error) {
          console.error('Error fetching restaurant data:', error);
        }
      }
    };

    fetchRestaurantData();
  }, [cartState.restaurant_id]);

  const calculateDeliveryDetails = () => {
    console.log('calculateDeliveryDetails called with:', {
      deliveryCoordinates: !!deliveryCoordinates,
      restaurantData: !!restaurantData,
      cartItems: cartState.items.length,
      deliveryCoords: deliveryCoordinates,
      restaurantCoords: restaurantData ? { lat: restaurantData.latitude, lng: restaurantData.longitude } : null
    });
    
    if (deliveryCoordinates && restaurantData && cartState.items.length > 0) {
      try {
        const restaurantLocation = { 
          lat: restaurantData.latitude, 
          lng: restaurantData.longitude 
        };
        
        const distance = calculateDistance(
          restaurantLocation.lat,
          restaurantLocation.lng,
          deliveryCoordinates.lat,
          deliveryCoordinates.lng
        );
        
        // Use restaurant's delivery fee per km if available
        const baseFee = 2.0;
        const perKmFee = restaurantData.delivery_fee_per_km || 1.5;
        const preparationTime = restaurantData.preparation_time || 15;
        
        const deliveryFee = calculateDeliveryFee(distance, baseFee, perKmFee);
        const estimatedTime = calculateDeliveryTime(distance, preparationTime, 15);
        
        setDeliveryInfo({ distance, deliveryFee, estimatedTime });
        console.log('Delivery details calculated:', { distance, deliveryFee, estimatedTime });
      } catch (error) {
        console.error('Error calculating delivery details:', error);
        // Set default delivery info if calculation fails
        setDeliveryInfo({ 
          distance: 5, // 5km default
          deliveryFee: 7.0, // £7 default fee
          estimatedTime: 30 // 30 minutes default
        });
      }
    } else {
      console.log('Missing data for delivery calculation:', {
        deliveryCoordinates: !!deliveryCoordinates,
        restaurantData: !!restaurantData,
        cartItems: cartState.items.length
      });
      // Set default delivery info even if we don't have all data
      setDeliveryInfo({ 
        distance: 5, // 5km default
        deliveryFee: 7.0, // £7 default fee
        estimatedTime: 30 // 30 minutes default
      });
    }
  };

  useEffect(() => {
    calculateDeliveryDetails();
  }, [deliveryCoordinates, restaurantData, cartState.restaurant_id, cartState.items.length]);

  // Debounced geocoding effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (addressInputValue.trim() && addressInputValue !== deliveryAddress) {
        handleAddressGeocoding(addressInputValue);
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [addressInputValue]);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleAddressInputChange = (address: string) => {
    setAddressInputValue(address);
  };

  const handleAddressGeocoding = async (address: string) => {
    setDeliveryAddress(address);
    
    if (address.trim()) {
      setIsGeocodingAddress(true);
      try {
        const coordinates = await geocodeAddress(address);
        if (coordinates) {
          setDeliveryCoordinates(coordinates);
          toast.success('Address verified successfully!');
        } else {
          toast.error('Could not find coordinates for this address');
          setDeliveryCoordinates(null);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
        toast.error('Error processing address');
        setDeliveryCoordinates(null);
      } finally {
        setIsGeocodingAddress(false);
      }
    } else {
      setDeliveryCoordinates(null);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const locationData = await getCurrentLocation();
      if (locationData) {
        setDeliveryAddress(locationData.address);
        setAddressInputValue(locationData.address);
        setDeliveryCoordinates({ lat: locationData.lat, lng: locationData.lng });
        toast.success('Current location set as delivery address!');
      } else {
        toast.error('Could not get your current location');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error('Error getting your current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const processOrder = async (orderData: any) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.success) {
      // Redirect to checkout with payment details
      window.location.href = `/checkout?order_id=${result.data.order_id}&client_secret=${result.data.client_secret}`;
    } else {
      toast.error(result.error || 'Failed to create order');
    }
  };

  const handleCheckout = async () => {
    if (!userInfo.name || !userInfo.email || !deliveryAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!deliveryInfo) {
      toast.error('Unable to calculate delivery details');
      return;
    }

    // Check if cart has items and restaurant_id
    console.log('Checkout validation - Cart state:', {
      restaurant_id: cartState.restaurant_id,
      items_length: cartState.items.length,
      items: cartState.items
    });

    if (!cartState.restaurant_id && cartState.items.length === 0) {
      toast.error('Your cart is empty. Please add items to cart first.');
      return;
    }

    if (!cartState.restaurant_id) {
      console.log('Restaurant ID missing, but items exist:', cartState.items);
      // Don't return here, let the fallback logic handle it
    }

    // If cart state is empty but we have localStorage data, try to use that
    if (cartState.items.length === 0) {
      if (typeof window !== 'undefined') {
        const cartKey = user ? `tegas-food-cart-${user.id}` : 'tegas-food-cart-guest';
        const localStorageCart = localStorage.getItem(cartKey);
        if (localStorageCart) {
        try {
          const parsedCart = JSON.parse(localStorageCart);
          console.log(`Cart state empty, but localStorage has data for key ${cartKey}:`, parsedCart);
          if (parsedCart.items && parsedCart.items.length > 0) {
            console.log('Using localStorage cart data for order');
            // Use localStorage data instead of cart state
            const orderData = {
              restaurant_id: parsedCart.restaurant_id,
              items: parsedCart.items.map((item: any) => ({
                menu_item_id: item.menu_item.id,
                quantity: item.quantity,
                special_instructions: item.special_instructions || ''
              })),
              delivery_address: deliveryAddress,
              delivery_latitude: deliveryCoordinates?.lat || 0,
              delivery_longitude: deliveryCoordinates?.lng || 0,
              user_info: {
                ...userInfo,
                phone: `${countryCode}${userInfo.phone}`
              },
              notes: ''
            };
            
            console.log('Sending order data from localStorage:', orderData);
            await processOrder(orderData);
            return;
          }
        } catch (error) {
          console.error('Error parsing localStorage cart:', error);
        }
        }
      }
      
      toast.error('Your cart is empty. Please add items to cart first.');
      return;
    }

    try {
      // If restaurant_id is missing from cart state, try to get it from the first menu item
      let restaurantId = cartState.restaurant_id;
      
      if (!restaurantId && cartState.items.length > 0) {
        console.log('Restaurant ID missing from cart state, getting from menu item:', cartState.items[0].menu_item);
        restaurantId = cartState.items[0].menu_item.restaurant_id;
      }
      
      // If still no restaurant_id, try to fetch it from the database using the first menu_item_id
      if (!restaurantId && cartState.items.length > 0) {
        console.log('Attempting to fetch restaurant_id from database for menu_item_id:', cartState.items[0].menu_item.id);
        try {
          const response = await fetch(`/api/menu-items/${cartState.items[0].menu_item.id}`);
          const data = await response.json();
          if (data.success && data.data.restaurant_id) {
            restaurantId = data.data.restaurant_id;
            console.log('Found restaurant_id from database:', restaurantId);
          }
        } catch (error) {
          console.error('Error fetching restaurant_id from database:', error);
        }
      }
      
      if (!restaurantId) {
        toast.error('Unable to determine restaurant. Please try adding items to cart again.');
        return;
      }

      const orderData = {
        restaurant_id: restaurantId,
        items: cartState.items.map(item => ({
          menu_item_id: item.menu_item.id,
          quantity: item.quantity,
          special_instructions: item.special_instructions || ''
        })),
        delivery_address: deliveryAddress,
        delivery_latitude: deliveryCoordinates?.lat || 0,
        delivery_longitude: deliveryCoordinates?.lng || 0,
        user_info: {
          ...userInfo,
          phone: `${countryCode}${userInfo.phone}`
        },
        notes: ''
      };

      console.log('Sending order data:', orderData);
      await processOrder(orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            {/* Mobile-only animated background */}
            <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent sm:text-gray-900">
              Your cart is empty
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Let&apos;s fix that! 🍽️
            </p>
            
            <div className="space-y-4">
              <Link
                href="/restaurants"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 sm:from-orange-600 sm:to-orange-700 text-white font-bold rounded-2xl sm:rounded-lg hover:from-orange-600 hover:to-red-600 sm:hover:bg-orange-700 transition-all duration-300 text-base touch-manipulation shadow-lg hover:shadow-xl transform hover:-translate-y-1 sm:hover:translate-y-0"
              >
                <span className="flex items-center space-x-2">
                  <span>Browse Restaurants</span>
                  <span className="text-lg">🍴</span>
                </span>
              </Link>
              
              {/* Mobile-only decorative elements */}
              <div className="sm:hidden mt-8 space-y-2">
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-500">Amazing Nigerian dishes await you!</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const total = subtotal + (deliveryInfo?.deliveryFee || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Header with Gradient */}
        <div className="relative overflow-hidden">
          {/* Mobile Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 opacity-5 sm:opacity-0 rounded-2xl"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0 p-4 sm:p-0">
            <div className="flex items-center space-x-4">
              <Link
                href="/restaurants"
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-all duration-300 bg-white/80 backdrop-blur-sm sm:bg-transparent rounded-full px-3 py-2 sm:px-0 sm:py-0 shadow-sm sm:shadow-none"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Back to Restaurants</span>
              </Link>
            </div>
            <div className="text-center sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent sm:text-gray-900">
                Shopping Cart
              </h1>
              <div className="mt-1 sm:hidden">
                <span className="inline-block w-12 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>


        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-4 sm:p-6 border border-orange-100 sm:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Items from {cartState.restaurant_name}
                </h2>
                <div className="sm:hidden">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {cartState.items.length} item{cartState.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {cartState.items.map((item, index) => (
                  <div key={item.menu_item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border border-gray-200 sm:border-gray-200 rounded-2xl sm:rounded-lg bg-gradient-to-r from-white to-orange-50/30 sm:bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl sm:rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-md">
                        {/* Mobile-only shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse sm:hidden"></div>
                        {item.menu_item.image_url ? (
                          <img
                            src={item.menu_item.image_url}
                            alt={item.menu_item.name}
                            className="w-full h-full object-cover rounded-2xl sm:rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center rounded-2xl sm:rounded-lg"
                          style={{ display: item.menu_item.image_url ? 'none' : 'flex' }}
                        >
                          <span className="text-white text-lg font-bold">
                            {item.menu_item.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Mobile-only item number badge */}
                      <div className="absolute -top-1 -right-1 sm:hidden">
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full shadow-md">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent sm:text-gray-900">
                        {item.menu_item.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs sm:text-sm text-gray-600">£{item.menu_item.price.toFixed(2)} each</p>
                        <div className="sm:hidden">
                          <span className="inline-block w-1 h-1 bg-orange-400 rounded-full"></span>
                        </div>
                      </div>
                      {item.special_instructions && (
                        <div className="mt-2 p-2 bg-orange-50 rounded-lg sm:bg-transparent sm:p-0">
                          <p className="text-xs text-orange-700 sm:text-gray-500 line-clamp-2">
                            <span className="font-medium sm:hidden">📝</span> {item.special_instructions}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.menu_item.id, item.quantity - 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 sm:bg-gray-100 flex items-center justify-center hover:from-orange-100 hover:to-orange-200 sm:hover:bg-gray-200 transition-all duration-300 touch-manipulation shadow-sm sm:shadow-none"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="relative">
                          <span className="w-8 text-center font-bold text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent sm:text-gray-900">
                            {item.quantity}
                          </span>
                          {/* Mobile-only quantity indicator */}
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 sm:hidden">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleQuantityChange(item.menu_item.id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 sm:bg-gray-100 flex items-center justify-center hover:from-orange-200 hover:to-orange-300 sm:hover:bg-gray-200 transition-all duration-300 touch-manipulation shadow-sm sm:shadow-none"
                        >
                          <Plus className="w-4 h-4 text-orange-600 sm:text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="text-right flex items-center space-x-2">
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm sm:text-base bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent sm:text-gray-900">
                            £{(item.menu_item.price * item.quantity).toFixed(2)}
                          </p>
                          {/* Mobile-only price indicator */}
                          <div className="sm:hidden mt-1">
                            <div className="flex items-center justify-end space-x-1">
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.menu_item.id)}
                          className="text-red-500 hover:text-red-700 transition-all duration-300 p-2 sm:p-1 touch-manipulation bg-red-50 hover:bg-red-100 rounded-full sm:bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-4 sm:p-6 border border-blue-100 sm:border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent sm:text-gray-900">
                  Delivery Information
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-gradient-to-r from-white to-blue-50/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-gradient-to-r from-white to-blue-50/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-3 sm:py-2 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-base shadow-sm focus:shadow-md transition-all duration-300"
                    >
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+45">🇩🇰 +45</option>
                      <option value="+46">🇸🇪 +46</option>
                      <option value="+47">🇳🇴 +47</option>
                      <option value="+358">🇫🇮 +358</option>
                      <option value="+48">🇵🇱 +48</option>
                      <option value="+420">🇨🇿 +420</option>
                      <option value="+36">🇭🇺 +36</option>
                      <option value="+40">🇷🇴 +40</option>
                      <option value="+359">🇧🇬 +359</option>
                      <option value="+385">🇭🇷 +385</option>
                      <option value="+386">🇸🇮 +386</option>
                      <option value="+421">🇸🇰 +421</option>
                      <option value="+371">🇱🇻 +371</option>
                      <option value="+372">🇪🇪 +372</option>
                      <option value="+370">🇱🇹 +370</option>
                      <option value="+377">🇲🇨 +377</option>
                      <option value="+376">🇦🇩 +376</option>
                      <option value="+378">🇸🇲 +378</option>
                      <option value="+39">🇻🇦 +39</option>
                      <option value="+356">🇲🇹 +356</option>
                      <option value="+357">🇨🇾 +357</option>
                      <option value="+30">🇬🇷 +30</option>
                    </select>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      className="flex-1 px-3 py-3 sm:py-2 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-gradient-to-r from-white to-blue-50/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <textarea
                      value={addressInputValue}
                      onChange={(e) => handleAddressInputChange(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-3 sm:py-2 pr-20 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base resize-none bg-gradient-to-r from-white to-blue-50/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                      placeholder="Enter your delivery address"
                      disabled={isGeocodingAddress}
                    />
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLoadingLocation || isGeocodingAddress}
                      className="absolute right-2 top-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Use current location"
                    >
                      {isLoadingLocation ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {isGeocodingAddress && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                      <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing address...
                    </p>
                  )}
                  {deliveryCoordinates && !isGeocodingAddress && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Address verified ✓
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-4 sm:p-6 sticky top-4 sm:top-24 border border-green-100 sm:border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent sm:text-gray-900">
                  Order Summary
                </h2>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {deliveryInfo && (
                  <>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">{formatCurrency(deliveryInfo.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                      <span>Distance: {deliveryInfo.distance.toFixed(1)} km</span>
                      <span>{formatDeliveryTime(deliveryInfo.estimatedTime)}</span>
                    </div>
                  </>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {deliveryInfo && (
                <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium text-blue-900">Estimated Delivery</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700">
                    {formatDeliveryTime(deliveryInfo.estimatedTime)} from order confirmation
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 sm:from-orange-600 sm:to-orange-700 text-white py-3 sm:py-4 px-4 rounded-2xl sm:rounded-lg font-bold hover:from-orange-600 hover:to-red-600 sm:hover:bg-orange-700 transition-all duration-300 text-base touch-manipulation shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:translate-y-0 sm:transform-none"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <div className="sm:hidden">
                    <span className="text-lg">🚀</span>
                  </div>
                </span>
              </button>
              
              <button
                onClick={clearCart}
                className="w-full mt-3 text-gray-600 hover:text-red-600 transition-all duration-300 text-xs sm:text-sm py-2 touch-manipulation bg-gray-50 hover:bg-red-50 rounded-2xl sm:rounded-lg sm:bg-transparent"
              >
                <span className="flex items-center justify-center space-x-1">
                  <span>Clear Cart</span>
                  <div className="sm:hidden">
                    <span className="text-sm">🗑️</span>
                  </div>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
