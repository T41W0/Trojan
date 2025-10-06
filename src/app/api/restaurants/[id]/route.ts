import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const restaurantId = id;

    const sql = 'SELECT * FROM restaurants WHERE id = ?';
    const restaurants = await query(sql, [restaurantId]);
    
    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const restaurant = restaurants[0];
    
    // Ensure numeric fields are properly formatted
    const processedRestaurant = {
      ...restaurant,
      rating: typeof restaurant.rating === 'string' ? parseFloat(restaurant.rating) : restaurant.rating,
      delivery_fee_per_km: typeof restaurant.delivery_fee_per_km === 'string' ? parseFloat(restaurant.delivery_fee_per_km) : restaurant.delivery_fee_per_km,
      preparation_time: typeof restaurant.preparation_time === 'string' ? parseInt(restaurant.preparation_time) : restaurant.preparation_time,
      latitude: typeof restaurant.latitude === 'string' ? parseFloat(restaurant.latitude) : restaurant.latitude,
      longitude: typeof restaurant.longitude === 'string' ? parseFloat(restaurant.longitude) : restaurant.longitude
    };

    return NextResponse.json({
      success: true,
      data: processedRestaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}
