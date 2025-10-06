import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Restaurant } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '10'; // Default 10km radius

    let sql = `
      SELECT r.*, 
             r.rating as rating,
             COUNT(DISTINCT mi.id) as menu_item_count
      FROM restaurants r
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id AND mi.is_available = 1
      WHERE r.is_active = 1
    `;

    const params: any[] = [];

    // If coordinates provided, filter by distance
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      // Validate coordinates are valid numbers
      if (!isNaN(latNum) && !isNaN(lngNum) && !isNaN(radiusNum) && 
          latNum >= -90 && latNum <= 90 && 
          lngNum >= -180 && lngNum <= 180) {
        sql += `
          AND (
            6371 * acos(
              cos(radians(?)) * cos(radians(latitude)) * 
              cos(radians(longitude) - radians(?)) + 
              sin(radians(?)) * sin(radians(latitude))
            )
          ) <= ?
        `;
        params.push(latNum, lngNum, latNum, radiusNum);
      }
    }

    sql += `
      GROUP BY r.id
      ORDER BY r.rating DESC, r.name ASC
    `;

    const restaurants = await query(sql, params);
    
    // Calculate distance and ensure rating is a number
    const processedRestaurants = restaurants.map((restaurant: any) => {
      let distance = null;
      
      // Calculate distance if coordinates are provided
      if (lat && lng) {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const restaurantLat = parseFloat(restaurant.latitude);
        const restaurantLng = parseFloat(restaurant.longitude);
        
        if (!isNaN(latNum) && !isNaN(lngNum) && !isNaN(restaurantLat) && !isNaN(restaurantLng)) {
          // Haversine formula for distance calculation
          const R = 6371; // Earth's radius in kilometers
          const dLat = (restaurantLat - latNum) * Math.PI / 180;
          const dLng = (restaurantLng - lngNum) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(latNum * Math.PI / 180) * Math.cos(restaurantLat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = R * c;
        }
      }
      
      return {
        ...restaurant,
        distance,
        rating: typeof restaurant.rating === 'string' ? parseFloat(restaurant.rating) : restaurant.rating,
        delivery_fee_per_km: typeof restaurant.delivery_fee_per_km === 'string' ? parseFloat(restaurant.delivery_fee_per_km) : restaurant.delivery_fee_per_km,
        preparation_time: typeof restaurant.preparation_time === 'string' ? parseInt(restaurant.preparation_time) : restaurant.preparation_time
      };
    });
    
    return NextResponse.json({
      success: true,
      data: processedRestaurants
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      address,
      latitude,
      longitude,
      phone,
      email,
      image_url,
      delivery_fee_per_km,
      preparation_time
    } = body;

    const sql = `
      INSERT INTO restaurants (
        name, description, address, latitude, longitude, 
        phone, email, image_url, delivery_fee_per_km, preparation_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      name, description, address, latitude, longitude,
      phone, email, image_url, delivery_fee_per_km || 2.0, preparation_time || 15
    ]);

    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId },
      message: 'Restaurant created successfully'
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      address,
      latitude,
      longitude,
      phone,
      email,
      image_url,
      delivery_fee_per_km,
      preparation_time,
      rating
    } = body;

    const sql = `
      UPDATE restaurants SET 
        name = ?, description = ?, address = ?, latitude = ?, longitude = ?,
        phone = ?, email = ?, image_url = ?, delivery_fee_per_km = ?, 
        preparation_time = ?, rating = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await query(sql, [
      name, description, address, latitude, longitude,
      phone, email, image_url, delivery_fee_per_km, preparation_time, rating, id
    ]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant updated successfully'
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update restaurant' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Soft delete - set is_active to false
    const sql = 'UPDATE restaurants SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await query(sql, [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete restaurant' },
      { status: 500 }
    );
  }
}
