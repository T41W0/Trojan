import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItemId = parseInt(id);

    if (isNaN(menuItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        mi.id,
        mi.restaurant_id,
        mi.category_id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.is_available,
        mi.preparation_time,
        mi.created_at,
        mi.updated_at
      FROM menu_items mi
      WHERE mi.id = ?
    `;

    const menuItems = await query(sql, [menuItemId]);

    if (menuItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    const menuItem = menuItems[0];

    return NextResponse.json({
      success: true,
      data: {
        id: menuItem.id,
        restaurant_id: menuItem.restaurant_id,
        category_id: menuItem.category_id,
        name: menuItem.name,
        description: menuItem.description,
        price: parseFloat(menuItem.price),
        image_url: menuItem.image_url,
        is_available: menuItem.is_available,
        preparation_time: menuItem.preparation_time,
        created_at: menuItem.created_at,
        updated_at: menuItem.updated_at
      }
    });

  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}
