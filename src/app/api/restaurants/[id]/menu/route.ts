import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const restaurantId = id;

    // Get restaurant details
    const restaurantSql = 'SELECT * FROM restaurants WHERE id = ? AND is_active = 1';
    const restaurants = await query(restaurantSql, [restaurantId]);
    
    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Get categories with menu items
    const menuSql = `
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.description as category_description,
        c.display_order,
        mi.id as item_id,
        mi.restaurant_id,
        mi.name as item_name,
        mi.description as item_description,
        mi.price,
        mi.image_url,
        mi.is_available,
        mi.preparation_time
      FROM categories c
      LEFT JOIN menu_items mi ON c.id = mi.category_id AND mi.is_available = 1
      WHERE c.restaurant_id = ?
      ORDER BY c.display_order, mi.name
    `;

    const menuData = await query(menuSql, [restaurantId]);
    console.log('Raw menu data from database:', menuData.slice(0, 2)); // Log first 2 items for debugging

    // Group menu items by category
    const menu = menuData.reduce((acc: any, item: any) => {
      const categoryId = item.category_id;
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: item.category_id,
          name: item.category_name,
          description: item.category_description,
          display_order: item.display_order,
          items: []
        };
      }

      if (item.item_id) {
        acc[categoryId].items.push({
          id: item.item_id,
          name: item.item_name,
          description: item.item_description,
          price: parseFloat(item.price),
          image_url: item.image_url,
          is_available: item.is_available,
          preparation_time: item.preparation_time,
          restaurant_id: item.restaurant_id
        });
      }

      return acc;
    }, {});

    const categories = Object.values(menu);

    return NextResponse.json({
      success: true,
      data: {
        restaurant: restaurants[0],
        menu: categories
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant menu' },
      { status: 500 }
    );
  }
}
