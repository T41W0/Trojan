'use client';

import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, Utensils, DollarSign, TrendingUp, Clock, UserPlus, Shield, Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalRestaurants: number;
  totalUsers: number;
  pendingOrders: number;
  completedOrders: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  restaurant_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  total_orders: number;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  image_url: string;
  rating: number;
  delivery_fee_per_km: number;
  preparation_time: number;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  restaurant_name: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  preparation_time: number;
  is_available: boolean;
  category_name: string;
  restaurant_name: string;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalRestaurants: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'menu' | 'restaurant' | 'delivery'>('overview');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; orderId: number | null; orderNumber: string }>({
    show: false,
    orderId: null,
    orderNumber: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [showEditMenuForm, setShowEditMenuForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    preparation_time: 15
  });
  const [editMenuItem, setEditMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    preparation_time: 15,
    is_available: true
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [restaurantCountryCode, setRestaurantCountryCode] = useState('+44');
  
  // Restaurant management state
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showEditRestaurantForm, setShowEditRestaurantForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editRestaurant, setEditRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    image_url: '',
    delivery_fee_per_km: '',
    preparation_time: '',
    rating: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users from API
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      // Fetch categories from API
      const categoriesResponse = await fetch('/api/admin/categories');
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
      }

      // Fetch menu items from API
      const menuItemsResponse = await fetch('/api/admin/menu-items');
      if (menuItemsResponse.ok) {
        const menuItemsData = await menuItemsResponse.json();
        setMenuItems(menuItemsData.menuItems);
      }

      // Fetch restaurants from API
      const restaurantsResponse = await fetch('/api/restaurants');
      if (restaurantsResponse.ok) {
        const restaurantsData = await restaurantsResponse.json();
        setRestaurants(restaurantsData.data || []);
      }

      // Fetch real orders from API
      const ordersResponse = await fetch('/api/admin/orders');
      let realOrders: RecentOrder[] = [];
      let totalOrders = 0;
      let pendingOrders = 0;
      let completedOrders = 0;
      let totalRevenue = 0;

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        if (ordersData.success) {
          realOrders = ordersData.orders.map((order: any) => ({
            id: order.id,
            order_number: order.id.toString(), // Using ID as order number for now
            restaurant_name: order.restaurant_name || 'Tega\'s Restaurant',
            total_amount: order.total_amount,
            status: order.status,
            created_at: order.created_at,
            customer_name: order.customer_name
          }));

          // Calculate stats from real data
          totalOrders = realOrders.length;
          pendingOrders = realOrders.filter(o => ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)).length;
          completedOrders = realOrders.filter(o => o.status === 'delivered').length;
          totalRevenue = realOrders.reduce((sum, order) => sum + order.total_amount, 0);
        }
      }

      // Use real data or fallback to mock data
      setStats({
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue || 0,
        totalRestaurants: restaurants.length || 1,
        totalUsers: users.length,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0
      });

      // Set real orders or show empty state
      setRecentOrders(realOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOrderStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setRecentOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId ? { ...order, status: newStatus } : order
            )
          );
          
          toast.success(`Order ${orderId} status updated to ${newStatus}`);
          console.log(`✅ Order ${orderId} status updated successfully`);
        } else {
          toast.error(`Failed to update order status: ${data.error}`);
        }
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      console.log(`🗑️ Deleting order ${orderId}...`);
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Remove order from local state
          setRecentOrders(prevOrders =>
            prevOrders.filter(order => order.id !== orderId)
          );
          
          // Update stats
          setStats(prevStats => ({
            ...prevStats,
            totalOrders: prevStats.totalOrders - 1
          }));
          
          toast.success(data.message || 'Order deleted successfully');
          console.log(`✅ Order ${orderId} deleted successfully`);
        } else {
          toast.error(`Failed to delete order: ${data.error}`);
        }
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Error deleting order');
    } finally {
      // Close confirmation dialog
      setDeleteConfirm({ show: false, orderId: null, orderNumber: '' });
    }
  };

  const confirmDeleteOrder = (orderId: number, orderNumber: string) => {
    setDeleteConfirm({
      show: true,
      orderId,
      orderNumber
    });
  };

  const handleMakeAdmin = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        
        toast.success(
          newRole === 'admin' 
            ? 'User promoted to admin successfully!' 
            : 'User role changed to regular user'
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleBlockUser = async (userId: number, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, is_active: !isActive }),
      });

      if (response.ok) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, is_active: !isActive } : user
          )
        );
        
        toast.success(
          !isActive 
            ? 'User unblocked successfully!' 
            : 'User blocked successfully!'
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const openEditRestaurantForm = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setEditRestaurant({
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      latitude: restaurant.latitude.toString(),
      longitude: restaurant.longitude.toString(),
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      image_url: restaurant.image_url || '',
      delivery_fee_per_km: restaurant.delivery_fee_per_km.toString(),
      preparation_time: restaurant.preparation_time.toString(),
      rating: restaurant.rating.toString()
    });
    setSelectedImage(null);
    setImagePreview(restaurant.image_url || '');
    setShowEditRestaurantForm(true);
  };

  const handleEditRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRestaurant || !editRestaurant.name || !editRestaurant.description || !editRestaurant.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Upload image if selected
      let imageUrl = editRestaurant.image_url;
      if (selectedImage) {
        const uploadedUrl = await uploadRestaurantImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return; // Stop if image upload failed
        }
      }

      const response = await fetch(`/api/restaurants?id=${editingRestaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editRestaurant.name,
          description: editRestaurant.description,
          address: editRestaurant.address,
          latitude: parseFloat(editRestaurant.latitude),
          longitude: parseFloat(editRestaurant.longitude),
          phone: `${restaurantCountryCode}${editRestaurant.phone}`,
          email: editRestaurant.email,
          image_url: imageUrl,
          delivery_fee_per_km: parseFloat(editRestaurant.delivery_fee_per_km),
          preparation_time: parseInt(editRestaurant.preparation_time),
          rating: parseFloat(editRestaurant.rating)
        }),
      });

      if (response.ok) {
        // Refresh restaurants
        const restaurantsResponse = await fetch('/api/restaurants');
        if (restaurantsResponse.ok) {
          const restaurantsData = await restaurantsResponse.json();
          setRestaurants(restaurantsData.data || []);
        }
        
        // Reset form and close edit mode
        setEditRestaurant({
          name: '',
          description: '',
          address: '',
          latitude: '',
          longitude: '',
          phone: '',
          email: '',
          image_url: '',
          delivery_fee_per_km: '',
          preparation_time: '',
          rating: ''
        });
        setEditingRestaurant(null);
        setSelectedImage(null);
        setImagePreview('');
        setShowEditRestaurantForm(false);
        
        toast.success('Restaurant updated successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update restaurant');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Failed to update restaurant');
    }
  };

  const handleDeleteRestaurant = async (restaurantId: number, restaurantName: string) => {
    if (!confirm(`Are you sure you want to delete "${restaurantName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants?id=${restaurantId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh restaurants
        const restaurantsResponse = await fetch('/api/restaurants');
        if (restaurantsResponse.ok) {
          const restaurantsData = await restaurantsResponse.json();
          setRestaurants(restaurantsData.data || []);
        }
        
        toast.success('Restaurant deleted successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete restaurant');
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error('Failed to delete restaurant');
    }
  };

  const handleToggleAvailability = async (itemId: number, newAvailability: boolean) => {
    try {
      const response = await fetch(`/api/admin/menu-items?id=${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_available: newAvailability
        }),
      });

      if (response.ok) {
        // Refresh menu items
        const menuItemsResponse = await fetch('/api/admin/menu-items');
        if (menuItemsResponse.ok) {
          const menuItemsData = await menuItemsResponse.json();
          setMenuItems(menuItemsData.menuItems);
        }
        
        toast.success(`Menu item ${newAvailability ? 'made available' : 'made unavailable'} successfully!`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update menu item availability');
      }
    } catch (error) {
      console.error('Error toggling menu item availability:', error);
      toast.error('Failed to update menu item availability');
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.price || !newMenuItem.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Upload image if selected
      let imageUrl = newMenuItem.image_url;
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return; // Stop if image upload failed
        }
      }

      const response = await fetch('/api/admin/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMenuItem,
          price: parseFloat(newMenuItem.price),
          preparation_time: parseInt(newMenuItem.preparation_time.toString()),
          image_url: imageUrl
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Refresh menu items
        const menuItemsResponse = await fetch('/api/admin/menu-items');
        if (menuItemsResponse.ok) {
          const menuItemsData = await menuItemsResponse.json();
          setMenuItems(menuItemsData.menuItems);
        }
        
        // Reset form
        setNewMenuItem({
          name: '',
          description: '',
          price: '',
          category_id: '',
          image_url: '',
          preparation_time: 15
        });
        setSelectedImage(null);
        setImagePreview('');
        setShowAddMenuForm(false);
        
        toast.success('Menu item added successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  const handleEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMenuItem || !editMenuItem.name || !editMenuItem.description || !editMenuItem.price || !editMenuItem.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Upload image if selected
      let imageUrl = editMenuItem.image_url;
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return; // Stop if image upload failed
        }
      }

      const response = await fetch('/api/admin/menu-items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingMenuItem.id,
          ...editMenuItem,
          price: parseFloat(editMenuItem.price),
          preparation_time: parseInt(editMenuItem.preparation_time.toString()),
          image_url: imageUrl
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Refresh menu items
        const menuItemsResponse = await fetch('/api/admin/menu-items');
        if (menuItemsResponse.ok) {
          const menuItemsData = await menuItemsResponse.json();
          setMenuItems(menuItemsData.menuItems);
        }
        
        // Reset form and close edit mode
        setEditMenuItem({
          name: '',
          description: '',
          price: '',
          category_id: '',
          image_url: '',
          preparation_time: 15,
          is_available: true
        });
        setEditingMenuItem(null);
        setSelectedImage(null);
        setImagePreview('');
        setShowEditMenuForm(false);
        
        toast.success('Menu item updated successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update menu item');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId: number, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menu-items?id=${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh menu items
        const menuItemsResponse = await fetch('/api/admin/menu-items');
        if (menuItemsResponse.ok) {
          const menuItemsData = await menuItemsResponse.json();
          setMenuItems(menuItemsData.menuItems);
        }
        
        toast.success('Menu item deleted successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const openEditForm = (item: MenuItem) => {
    setEditingMenuItem(item);
    setEditMenuItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category_id: categories.find(cat => cat.name === item.category_name)?.id.toString() || '',
      image_url: item.image_url || '',
      preparation_time: item.preparation_time,
      is_available: item.is_available
    });
    setImagePreview(item.image_url || '');
    setShowEditMenuForm(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please select a JPEG, PNG, or WebP image.');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File too large. Please select an image smaller than 5MB.');
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Image uploaded successfully!');
        return result.imageUrl;
      } else {
        toast.error(result.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadRestaurantImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch('/api/admin/upload-restaurant-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Restaurant image uploaded successfully!');
        return result.imageUrl;
      } else {
        toast.error(result.error || 'Failed to upload restaurant image');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload restaurant image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const resetImageUpload = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (editingMenuItem) {
      setImagePreview(editingMenuItem.image_url || '');
    } else if (editingRestaurant) {
      setImagePreview(editingRestaurant.image_url || '');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user has admin access
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">You need admin privileges to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your food delivery platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2 sm:gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'overview'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">User Management</span>
              <span className="sm:hidden">Users</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'menu'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Menu Management</span>
              <span className="sm:hidden">Menu</span>
            </button>
            <button
              onClick={() => setActiveTab('restaurant')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'restaurant'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Restaurant Management</span>
              <span className="sm:hidden">Restaurant</span>
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'delivery'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Delivery Info</span>
              <span className="sm:hidden">Delivery</span>
            </button>
            <Link
              href="/admin/order-simulator"
              className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Order Simulator</span>
              <span className="sm:hidden">Simulator</span>
            </Link>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Restaurants</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalRestaurants}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Users</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
        </div>

        {/* Order Status Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-600 mt-1">Orders awaiting processing</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Completed Orders</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
            <p className="text-sm text-gray-600 mt-1">Successfully delivered</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button
              onClick={() => fetchDashboardData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Refresh Orders
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No orders yet</p>
                        <p className="text-xs text-gray-500 mt-1">Orders will appear here once customers place them</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.restaurant_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => confirmDeleteOrder(order.id, order.order_number)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <Utensils className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Manage Restaurants</h3>
                </div>
                <p className="text-gray-600">Add, edit, or remove restaurants from the platform</p>
              </button>

              <button className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">View All Orders</h3>
                </div>
                <p className="text-gray-600">Browse and manage all customer orders</p>
              </button>

              <button className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                </div>
                <p className="text-gray-600">View detailed reports and analytics</p>
              </button>
            </div>
          </>
        ) : activeTab === 'users' ? (
          /* User Management Tab */
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <UserPlus className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Administrator' : 'Customer'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.total_orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleMakeAdmin(user.id, user.role)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              user.role === 'admin'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleBlockUser(user.id, user.is_active)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              user.is_active
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.is_active ? 'Block' : 'Unblock'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'menu' ? (
          /* Menu Management Tab */
          <div className="space-y-6">
            {/* Add Menu Item Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
                  <p className="text-gray-600">Manage your restaurant's menu items</p>
                </div>
                <button
                  onClick={() => setShowAddMenuForm(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Menu Item</span>
                </button>
              </div>
            </div>

            {/* Add Menu Item Form */}
            {showAddMenuForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Menu Item</h4>
                <form onSubmit={handleAddMenuItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Jollof Rice"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={newMenuItem.category_id}
                        onChange={(e) => setNewMenuItem({...newMenuItem, category_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe the dish..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (£) *
                      </label>
                      <input
                        type="number"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="25.00"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preparation Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={newMenuItem.preparation_time}
                        onChange={(e) => setNewMenuItem({...newMenuItem, preparation_time: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="15"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Menu Image
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={resetImageUpload}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          <p>Supported formats: JPEG, PNG, WebP</p>
                          <p>Max size: 5MB</p>
                        </div>
                        <input
                          type="url"
                          value={newMenuItem.image_url}
                          onChange={(e) => setNewMenuItem({...newMenuItem, image_url: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Or enter image URL (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenuForm(false);
                        setSelectedImage(null);
                        setImagePreview('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <span>Add Menu Item</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Menu Item Form */}
            {showEditMenuForm && editingMenuItem && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Menu Item: {editingMenuItem.name}</h4>
                <form onSubmit={handleEditMenuItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={editMenuItem.name}
                        onChange={(e) => setEditMenuItem({...editMenuItem, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Jollof Rice"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={editMenuItem.category_id}
                        onChange={(e) => setEditMenuItem({...editMenuItem, category_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={editMenuItem.description}
                      onChange={(e) => setEditMenuItem({...editMenuItem, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe the dish..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (£) *
                      </label>
                      <input
                        type="number"
                        value={editMenuItem.price}
                        onChange={(e) => setEditMenuItem({...editMenuItem, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="25.00"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preparation Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={editMenuItem.preparation_time}
                        onChange={(e) => setEditMenuItem({...editMenuItem, preparation_time: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="15"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Menu Image
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={resetImageUpload}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          <p>Supported formats: JPEG, PNG, WebP</p>
                          <p>Max size: 5MB</p>
                        </div>
                        <input
                          type="url"
                          value={editMenuItem.image_url}
                          onChange={(e) => setEditMenuItem({...editMenuItem, image_url: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Or enter image URL (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editMenuItem.is_available}
                        onChange={(e) => setEditMenuItem({...editMenuItem, is_available: e.target.checked})}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Available for ordering</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditMenuForm(false);
                        setEditingMenuItem(null);
                        setEditMenuItem({
                          name: '',
                          description: '',
                          price: '',
                          category_id: '',
                          image_url: '',
                          preparation_time: 15,
                          is_available: true
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <span>Update Menu Item</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Menu Items Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Menu Items ({menuItems.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prep Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
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
                              className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center rounded-lg"
                              style={{ display: item.image_url ? 'none' : 'flex' }}
                            >
                              <span className="text-white text-xs font-bold">
                                {item.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {item.category_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          £{item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.preparation_time} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleAvailability(item.id, !item.is_available)}
                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                              item.is_available
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title={`Click to ${item.is_available ? 'make unavailable' : 'make available'}`}
                          >
                            <span className="w-2 h-2 rounded-full mr-2 ${
                              item.is_available ? 'bg-green-500' : 'bg-red-500'
                            }"></span>
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => openEditForm(item)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                            title="Edit menu item"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMenuItem(item.id, item.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete menu item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {menuItems.length === 0 && (
                <div className="text-center py-8">
                  <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No menu items found.</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'restaurant' ? (
          /* Restaurant Management Tab */
          <div className="space-y-6">
            {/* Restaurant Management Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Restaurant Management</h3>
                  <p className="text-gray-600">Manage your restaurant details and settings</p>
                </div>
              </div>
            </div>

            {/* Edit Restaurant Form */}
            {showEditRestaurantForm && editingRestaurant && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Restaurant: {editingRestaurant.name}</h4>
                <form onSubmit={handleEditRestaurant} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Restaurant Name *
                      </label>
                      <input
                        type="text"
                        value={editRestaurant.name}
                        onChange={(e) => setEditRestaurant({...editRestaurant, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Tega Restaurant"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={restaurantCountryCode}
                          onChange={(e) => setRestaurantCountryCode(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
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
                          value={editRestaurant.phone}
                          onChange={(e) => setEditRestaurant({...editRestaurant, phone: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="20 1234 5678"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={editRestaurant.description}
                      onChange={(e) => setEditRestaurant({...editRestaurant, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe your restaurant..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={editRestaurant.address}
                      onChange={(e) => setEditRestaurant({...editRestaurant, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="123 Main Street, London, UK"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={editRestaurant.latitude}
                        onChange={(e) => setEditRestaurant({...editRestaurant, latitude: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="51.5074"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={editRestaurant.longitude}
                        onChange={(e) => setEditRestaurant({...editRestaurant, longitude: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="-0.1278"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editRestaurant.email}
                        onChange={(e) => setEditRestaurant({...editRestaurant, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="info@tegasrestaurant.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Fee per km (£)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editRestaurant.delivery_fee_per_km}
                        onChange={(e) => setEditRestaurant({...editRestaurant, delivery_fee_per_km: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="2.00"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preparation Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={editRestaurant.preparation_time}
                        onChange={(e) => setEditRestaurant({...editRestaurant, preparation_time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="15"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating (0-5)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={editRestaurant.rating}
                        onChange={(e) => setEditRestaurant({...editRestaurant, rating: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="4.5"
                        min="0"
                        max="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Restaurant Image
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={resetImageUpload}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          <p>Supported formats: JPEG, PNG, WebP</p>
                          <p>Max size: 5MB</p>
                        </div>
                        <input
                          type="url"
                          value={editRestaurant.image_url}
                          onChange={(e) => setEditRestaurant({...editRestaurant, image_url: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Or enter image URL (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditRestaurantForm(false);
                        setEditingRestaurant(null);
                        setEditRestaurant({
                          name: '',
                          description: '',
                          address: '',
                          latitude: '',
                          longitude: '',
                          phone: '',
                          email: '',
                          image_url: '',
                          delivery_fee_per_km: '',
                          preparation_time: '',
                          rating: ''
                        });
                        setSelectedImage(null);
                        setImagePreview('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <span>Update Restaurant</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Restaurants Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Restaurants ({restaurants.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {restaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{restaurant.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 truncate max-w-xs">{restaurant.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{restaurant.rating.toFixed(1)}</span>
                            <span className="text-yellow-400 ml-1">★</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          £{restaurant.delivery_fee_per_km}/km
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            restaurant.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {restaurant.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => openEditRestaurantForm(restaurant)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                            title="Edit restaurant"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRestaurant(restaurant.id, restaurant.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete restaurant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {restaurants.length === 0 && (
                <div className="text-center py-8">
                  <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No restaurants found.</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'delivery' ? (
          /* Delivery Info Tab */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Delivery Settings */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800">Delivery Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Delivery Fee (£)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="2.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fee Per Kilometer (£)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="1.50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Delivery Distance (km)
                      </label>
                      <input
                        type="number"
                        placeholder="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Order Amount (£)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="10.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Zones */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800">Delivery Zones</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Area
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Enter delivery areas (e.g., London, Manchester, Birmingham)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Hours
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="time"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <input
                          type="time"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Days
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <label key={day} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Statistics */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-800 mb-4">Delivery Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Delivery Time</p>
                        <p className="text-2xl font-bold text-gray-900">32 min</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                        <p className="text-2xl font-bold text-gray-900">1,247</p>
                      </div>
                      <ShoppingBag className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-gray-900">98.5%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors">
                  Save Delivery Settings
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete order <span className="font-semibold">#{deleteConfirm.orderNumber}</span>? 
              This will permanently remove the order and all its associated data.
            </p>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteConfirm({ show: false, orderId: null, orderNumber: '' })}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm.orderId && handleDeleteOrder(deleteConfirm.orderId)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
