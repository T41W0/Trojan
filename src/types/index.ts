export interface Restaurant {
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
  created_at: string;
  updated_at: string;
  distance?: number;
}

export interface Category {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  display_order: number;
  created_at: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  preparation_time: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  special_instructions?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  default_address: string;
  default_latitude: number;
  default_longitude: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  distance_km: number;
  estimated_delivery_time: string;
  payment_status: PaymentStatus;
  payment_intent_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
  restaurant?: Restaurant;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions: string;
  created_at: string;
  menu_item?: MenuItem;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface DeliveryInfo {
  distance: number;
  deliveryFee: number;
  estimatedTime: number;
  preparationTime: number;
  totalTime: number;
}

export interface CheckoutData {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
    latitude: number;
    longitude: number;
  };
  payment: {
    cardToken: string;
  };
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
