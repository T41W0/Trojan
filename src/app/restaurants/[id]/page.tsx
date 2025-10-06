'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Clock, Truck, MapPin, Plus, Minus, ShoppingCart, Search } from 'lucide-react';
import { Restaurant, Category, MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const { addItem, state: cartState } = useCart();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenu, setFilteredMenu] = useState<Category[]>([]);

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId]);

  // Filter menu items based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMenu(menu);
    } else {
      // Collect all matching items from all categories
      const allMatchingItems: any[] = [];
      
      menu.forEach(category => {
        const matchingItems = category.items?.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
        
        if (matchingItems.length > 0) {
          allMatchingItems.push(...matchingItems);
        }
      });
      
      // Create a single "Search Results" category with all matching items
      const searchResultsCategory: any = {
        id: 'search-results',
        name: 'Search Results',
        description: `Found ${allMatchingItems.length} item(s) matching "${searchTerm}"`,
        items: allMatchingItems,
        restaurant_id: menu[0]?.restaurant_id || 0,
        display_order: 0,
        created_at: new Date().toISOString()
      };
      
      setFilteredMenu([searchResultsCategory]);
    }
  }, [menu, searchTerm]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/restaurants/${restaurantId}/menu`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Restaurant data received:', data.data);
        setRestaurant(data.data.restaurant);
        setMenu(data.data.menu);
        
        // Set first category as selected if menu exists
        if (data.data.menu.length > 0) {
          setSelectedCategory(data.data.menu[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (menuItem: MenuItem, quantity: number) => {
    console.log('Adding menu item to cart:', {
      menuItem,
      menuItemRestaurantId: menuItem.restaurant_id,
      cartRestaurantId: cartState.restaurant_id
    });
    
    // Check if adding to different restaurant
    if (cartState.restaurant_id && cartState.restaurant_id !== menuItem.restaurant_id) {
      toast.error('You can only order from one restaurant at a time');
      return;
    }

    addItem(menuItem, quantity);
    setQuantities({ ...quantities, [menuItem.id]: 0 }); // Reset quantity after adding
  };

  const updateQuantity = (itemId: number, change: number) => {
    const currentQty = quantities[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);
    setQuantities({ ...quantities, [itemId]: newQty });
  };

  const formatRating = (rating: number | string | null) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return numRating && !isNaN(numRating) ? numRating.toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl sm:rounded-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl sm:rounded-lg mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl sm:rounded-lg mb-6"></div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl sm:rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🍽️</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent">
            Restaurant not found
          </h1>
          <Link 
            href="/restaurants" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center space-x-2">
              <span>← Back to Restaurants</span>
              <span>🏪</span>
            </span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get the menu to display based on search and category selection
  const displayMenu = () => {
    // If searching, show search results and ignore category selection
    if (searchTerm.trim() !== '') {
      return filteredMenu;
    }
    
    // If not searching, apply category filter
    if (selectedCategory) {
      return menu.filter(category => category.id.toString() === selectedCategory);
    }
    
    // Show all categories
    return menu;
  };

  // Helper function to highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      <Header />
      
      {/* Restaurant Header */}
      <section className="relative overflow-hidden">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 opacity-5 sm:opacity-0"></div>
        
        <div className="relative bg-white sm:bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="h-64 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl sm:rounded-lg relative overflow-hidden shadow-lg">
                  {/* Mobile-only shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse sm:hidden"></div>
                  {restaurant.image_url ? (
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {restaurant.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent sm:text-gray-900">
                      {formatRating(restaurant.rating)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent sm:text-gray-900">
                  {restaurant.name}
                </h1>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{restaurant.description}</p>
                
                <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 bg-orange-50 rounded-full px-3 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    <span className="font-medium">{restaurant.preparation_time} min prep time</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 bg-green-50 rounded-full px-3 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="font-medium">£{restaurant.delivery_fee_per_km}/km delivery</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 bg-blue-50 rounded-full px-3 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span className="font-medium">{restaurant.address}</span>
                  </div>
                </div>
              </div>

              {restaurant.phone && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {restaurant.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md p-4 sm:p-6 sticky top-4 sm:top-24 border border-orange-100 sm:border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent sm:text-gray-900">
                    Categories
                  </h3>
                </div>
                <nav className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-2xl sm:rounded-lg transition-all duration-300 ${
                      selectedCategory === '' 
                        ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 font-bold shadow-md' 
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>All Items</span>
                      <span className="text-xs">🍽️</span>
                    </span>
                  </button>
                  {menu.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`w-full text-left px-3 py-2 rounded-2xl sm:rounded-lg transition-all duration-300 ${
                        selectedCategory === category.id.toString()
                          ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 font-bold shadow-md'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span>{category.name}</span>
                          <span className="text-xs sm:hidden">{index === 0 ? '🍚' : index === 1 ? '🥘' : index === 2 ? '🍖' : '🍹'}</span>
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                          ({(category as any).items?.length || 0})
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Menu Items */}
            <div className="lg:col-span-3">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🍽️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent sm:text-gray-900">
                  Menu
                </h2>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for food items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl sm:rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gradient-to-r from-white to-orange-50/30 sm:bg-white shadow-sm focus:shadow-md transition-all duration-300"
                  />
                </div>
                {searchTerm && (
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {filteredMenu.length > 0 && (filteredMenu[0] as any).id === 'search-results'
                        ? `Found ${filteredMenu[0].items?.length || 0} item(s) across all categories`
                        : 'No items found'
                      }
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
              
              {displayMenu().map((category) => (
                <div key={category.id} className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    {(category as any).id === 'search-results' && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        🔍 Search Results
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-gray-600 mb-4">{category.description}</p>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {(category as any).items?.map((item: any, itemIndex: number) => (
                      <div key={item.id} className="bg-white rounded-2xl sm:rounded-lg shadow-lg sm:shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:translate-y-0 border border-orange-100 sm:border-gray-200 group">
                        <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 relative overflow-hidden">
                          {/* Mobile-only shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse sm:hidden"></div>
                          
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                            className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center"
                            style={{ display: item.image_url ? 'none' : 'flex' }}
                          >
                            <span className="text-white text-2xl font-bold">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                          
                          {/* Mobile-only item number badge */}
                          <div className="absolute top-2 left-2 sm:hidden">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-orange-500 rounded-full shadow-md">
                              {itemIndex + 1}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 sm:p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent sm:text-gray-900">
                                {highlightText(item.name, searchTerm)}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">{highlightText(item.description, searchTerm)}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent sm:text-orange-600">
                                  £{item.price.toFixed(2)}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 sm:bg-gray-100 flex items-center justify-center hover:from-orange-100 hover:to-orange-200 sm:hover:bg-gray-200 transition-all duration-300 touch-manipulation shadow-sm sm:shadow-none"
                                  >
                                    <Minus className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <div className="relative">
                                    <span className="w-8 text-center font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent sm:text-gray-900">
                                      {quantities[item.id] || 0}
                                    </span>
                                    {/* Mobile-only quantity indicator */}
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 sm:hidden">
                                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 sm:bg-gray-100 flex items-center justify-center hover:from-orange-200 hover:to-orange-300 sm:hover:bg-gray-200 transition-all duration-300 touch-manipulation shadow-sm sm:shadow-none"
                                  >
                                    <Plus className="w-4 h-4 text-orange-600 sm:text-gray-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {quantities[item.id] > 0 && (
                            <button
                              onClick={() => handleAddToCart(item, quantities[item.id])}
                              className="w-full bg-gradient-to-r from-orange-500 to-red-500 sm:from-orange-600 sm:to-orange-700 text-white py-3 sm:py-2 px-4 rounded-2xl sm:rounded-lg hover:from-orange-600 hover:to-red-600 sm:hover:bg-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 sm:hover:translate-y-0 sm:transform-none"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add to Cart</span>
                              <div className="sm:hidden">
                                <span className="text-lg">🛒</span>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      {cartState.items.length > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 sm:from-orange-600 sm:to-orange-700 text-white p-4 sm:p-4 rounded-2xl sm:rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 sm:hover:bg-orange-700 transition-all duration-300 z-50 transform hover:scale-105"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartState.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                {cartState.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
        </Link>
      )}

      <Footer />
    </div>
  );
}
