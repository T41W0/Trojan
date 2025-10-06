'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  default_address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { name: string; email: string; password: string; phone: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('tegas-food-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('tegas-food-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('tegas-food-user', JSON.stringify(data.user));
        
        // Check for redirect after authentication
        const redirectPath = localStorage.getItem('tegas-food-redirect-after-auth');
        if (redirectPath) {
          localStorage.removeItem('tegas-food-redirect-after-auth');
          router.push(redirectPath);
        }
        
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; phone: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('tegas-food-user', JSON.stringify(data.user));
        
        // Check for redirect after authentication
        const redirectPath = localStorage.getItem('tegas-food-redirect-after-auth');
        if (redirectPath) {
          localStorage.removeItem('tegas-food-redirect-after-auth');
          router.push(redirectPath);
        }
        
        return true;
      } else {
        console.error('Signup failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user-specific cart data before logging out
    if (user) {
      localStorage.removeItem(`tegas-food-cart-${user.id}`);
    }
    setUser(null);
    localStorage.removeItem('tegas-food-user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
