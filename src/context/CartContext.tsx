'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MenuItem } from '@/types';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  special_instructions?: string;
}

interface CartState {
  items: CartItem[];
  restaurant_id: number | null;
  restaurant_name: string;
  pendingItems: CartItem[]; // Items waiting to be added after authentication
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menu_item: MenuItem; quantity: number; special_instructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: { menu_item_id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { menu_item_id: number; quantity: number } }
  | { type: 'UPDATE_INSTRUCTIONS'; payload: { menu_item_id: number; special_instructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_RESTAURANT'; payload: { restaurant_id: number; restaurant_name: string } }
  | { type: 'ADD_PENDING_ITEM'; payload: { menu_item: MenuItem; quantity: number; special_instructions?: string } }
  | { type: 'CLEAR_PENDING_ITEMS' }
  | { type: 'RESTORE_PENDING_ITEMS' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (menu_item: MenuItem, quantity: number, special_instructions?: string) => void;
  removeItem: (menu_item_id: number) => void;
  updateQuantity: (menu_item_id: number, quantity: number) => void;
  updateInstructions: (menu_item_id: number, special_instructions: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  addPendingItem: (menu_item: MenuItem, quantity: number, special_instructions?: string) => void;
  restorePendingItems: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log('Cart reducer called with action:', action);
  console.log('Current cart state:', state);
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menu_item, quantity, special_instructions } = action.payload;
      
      console.log('Adding item to cart:', {
        menu_item,
        current_restaurant_id: state.restaurant_id,
        menu_item_restaurant_id: menu_item.restaurant_id
      });
      
      // Check if adding to different restaurant
      if (state.restaurant_id && state.restaurant_id !== menu_item.restaurant_id) {
        toast.error('You can only order from one restaurant at a time');
        return state;
      }

      const existingItemIndex = state.items.findIndex(
        item => item.menu_item.id === menu_item.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                special_instructions: special_instructions || item.special_instructions
              }
            : item
        );
      } else {
        newItems = [...state.items, { menu_item, quantity, special_instructions }];
      }

      const newState = {
        ...state,
        items: newItems,
        restaurant_id: menu_item.restaurant_id,
        restaurant_name: state.restaurant_name
      };
      
      console.log('New cart state after adding item:', newState);
      return newState;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => item.menu_item.id !== action.payload.menu_item_id
      );
      
      return {
        ...state,
        items: newItems,
        restaurant_id: newItems.length === 0 ? null : state.restaurant_id,
        restaurant_name: newItems.length === 0 ? '' : state.restaurant_name
      };
    }

    case 'UPDATE_QUANTITY': {
      const { menu_item_id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { menu_item_id } });
      }

      const newItems = state.items.map(item =>
        item.menu_item.id === menu_item_id
          ? { ...item, quantity }
          : item
      );

      return {
        ...state,
        items: newItems,
        restaurant_id: newItems.length === 0 ? null : state.restaurant_id,
        restaurant_name: newItems.length === 0 ? '' : state.restaurant_name
      };
    }

    case 'UPDATE_INSTRUCTIONS': {
      const { menu_item_id, special_instructions } = action.payload;
      
      const newItems = state.items.map(item =>
        item.menu_item.id === menu_item_id
          ? { ...item, special_instructions }
          : item
      );

      return { ...state, items: newItems };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        restaurant_id: null,
        restaurant_name: '',
        pendingItems: []
      };

    case 'SET_RESTAURANT':
      return {
        ...state,
        restaurant_id: action.payload.restaurant_id,
        restaurant_name: action.payload.restaurant_name
      };

    case 'ADD_PENDING_ITEM': {
      const { menu_item, quantity, special_instructions } = action.payload;
      const existingPendingIndex = state.pendingItems.findIndex(
        item => item.menu_item.id === menu_item.id
      );

      let newPendingItems;
      if (existingPendingIndex >= 0) {
        newPendingItems = [...state.pendingItems];
        newPendingItems[existingPendingIndex].quantity += quantity;
      } else {
        newPendingItems = [...state.pendingItems, {
          menu_item,
          quantity,
          special_instructions
        }];
      }

      return {
        ...state,
        pendingItems: newPendingItems
      };
    }

    case 'CLEAR_PENDING_ITEMS':
      return {
        ...state,
        pendingItems: []
      };

    case 'RESTORE_PENDING_ITEMS': {
      // Add all pending items to the cart
      let newItems = [...state.items];
      const newRestaurantId = state.pendingItems.length > 0 ? state.pendingItems[0].menu_item.restaurant_id : state.restaurant_id;
      const newRestaurantName = state.pendingItems.length > 0 ? 'Restaurant' : state.restaurant_name;

      state.pendingItems.forEach(pendingItem => {
        const existingIndex = newItems.findIndex(
          item => item.menu_item.id === pendingItem.menu_item.id
        );

        if (existingIndex >= 0) {
          newItems[existingIndex].quantity += pendingItem.quantity;
        } else {
          newItems.push(pendingItem);
        }
      });

      return {
        ...state,
        items: newItems,
        restaurant_id: newRestaurantId,
        restaurant_name: newRestaurantName,
        pendingItems: []
      };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  restaurant_id: null,
  restaurant_name: '',
  pendingItems: []
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const router = useRouter();

  // Get user-specific cart key
  const getCartKey = () => {
    return user ? `tegas-food-cart-${user.id}` : 'tegas-food-cart-guest';
  };

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    console.log(`Loading cart from localStorage for key: ${cartKey}`, savedCart);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Parsed cart from localStorage:', parsedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          // Clear current state first
          dispatch({ type: 'CLEAR_CART' });
          
          // Load each item
          parsedCart.items.forEach((item: any) => {
            if (item.menu_item && item.quantity > 0) {
              dispatch({
                type: 'ADD_ITEM',
                payload: {
                  menu_item: item.menu_item,
                  quantity: item.quantity,
                  special_instructions: item.special_instructions
                }
              });
            }
          });
          
          // Set restaurant info if available
          if (parsedCart.restaurant_id && parsedCart.restaurant_name) {
            dispatch({
              type: 'SET_RESTAURANT',
              payload: {
                restaurant_id: parsedCart.restaurant_id,
                restaurant_name: parsedCart.restaurant_name
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    } else {
      // No saved cart found, clear current state
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user?.id]); // Re-run when user changes

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartKey = getCartKey();
    console.log(`Saving cart to localStorage for key: ${cartKey}`, state);
    localStorage.setItem(cartKey, JSON.stringify(state));
  }, [state, user?.id]);

  // Restore pending items when user logs in
  useEffect(() => {
    if (user && state.pendingItems.length > 0) {
      dispatch({ type: 'RESTORE_PENDING_ITEMS' });
      toast.success(`${state.pendingItems.length} item(s) added to your cart!`);
    }
  }, [user?.id]); // Only run when user changes

  // Note: Cart persists across login/logout sessions
  // Only clears when user explicitly clears it or completes an order

  const addItem = (menu_item: MenuItem, quantity: number, special_instructions?: string) => {
    // Check if user is authenticated
    if (!user) {
      // Add item to pending items and redirect to signup
      dispatch({
        type: 'ADD_PENDING_ITEM',
        payload: { menu_item, quantity, special_instructions }
      });
      
      toast.error('Please sign up to add items to your cart', {
        duration: 3000,
        icon: '🔐',
      });
      
      // Store current page to redirect back after signup
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('tegas-food-redirect-after-auth', currentPath);
      
      // Redirect to signup page
      router.push('/auth/signup');
      return;
    }

    // User is authenticated, add item normally
    dispatch({
      type: 'ADD_ITEM',
      payload: { menu_item, quantity, special_instructions }
    });
    toast.success(`${quantity}x ${menu_item.name} added to cart`);
  };

  const removeItem = (menu_item_id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { menu_item_id } });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (menu_item_id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menu_item_id, quantity } });
  };

  const updateInstructions = (menu_item_id: number, special_instructions: string) => {
    dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { menu_item_id, special_instructions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.menu_item.price * item.quantity), 0);
  };

  const getTotalPrice = () => {
    return getSubtotal(); // Delivery fee will be calculated separately
  };

  const addPendingItem = (menu_item: MenuItem, quantity: number, special_instructions?: string) => {
    dispatch({
      type: 'ADD_PENDING_ITEM',
      payload: { menu_item, quantity, special_instructions }
    });
  };

  const restorePendingItems = () => {
    if (state.pendingItems.length > 0) {
      dispatch({ type: 'RESTORE_PENDING_ITEMS' });
      toast.success(`${state.pendingItems.length} item(s) added to your cart!`);
    }
  };

  const value = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    updateInstructions,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    addPendingItem,
    restorePendingItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
