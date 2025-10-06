import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate delivery fee based on distance
export function calculateDeliveryFee(
  distance: number,
  baseFee: number = 2.0,
  perKmFee: number = 1.5
): number {
  const fee = baseFee + (distance * perKmFee);
  return Math.round(fee * 100) / 100; // Round to 2 decimal places
}

// Calculate estimated delivery time
export function calculateDeliveryTime(
  distance: number,
  preparationTime: number = 15,
  baseDeliveryTime: number = 15
): number {
  // Assume average delivery speed of 30 km/h in city
  const deliveryTimeMinutes = (distance / 30) * 60;
  const totalTime = preparationTime + deliveryTimeMinutes + baseDeliveryTime;
  return Math.round(totalTime);
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  const crypto = Math.random().toString(36).substr(2, 6);
  const orderId = `TF-${timestamp}-${random}-${crypto}`.toUpperCase();
  
  // Add some additional uniqueness
  const checksum = orderId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `${orderId}-${Math.abs(checksum).toString(36).substr(0, 3)}`;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

// Format delivery time
export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Geocode address to coordinates using OpenStreetMap Nominatim API
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=gb`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Reverse geocode coordinates to address using OpenStreetMap Nominatim API
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

// Get user's current location with permission
export async function getCurrentLocation(): Promise<{ lat: number; lng: number; address: string } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Try to get address from coordinates
        const address = await reverseGeocode(lat, lng);
        
        resolve({
          lat,
          lng,
          address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}
