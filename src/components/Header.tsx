'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, MapPin, User, Menu as MenuIcon, X, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/image.png" 
              alt="Tega's Food Logo" 
              className="h-32 w-32 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link href="/restaurants" className="text-gray-700 hover:text-orange-500 transition-colors">
              Restaurants
            </Link>
            <Link href="/track-order" className="text-gray-700 hover:text-orange-500 transition-colors">
              Track Order
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-orange-500 transition-colors">
              My Orders
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <button className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Select Location</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block text-sm">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin Panel Button */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:block text-sm">Admin</span>
              </Link>
            )}

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/restaurants" 
                className="text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Restaurants
              </Link>
              
              <Link 
                href="/track-order" 
                className="text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Order
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/orders" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link 
                    href="/profile" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="text-gray-700 hover:text-orange-500 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              
              <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Select Location</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
