import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, category_id, image_url, preparation_time } = await request.json();

    if (!name || !description || !price || !category_id) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Get restaurant ID from category
    const categoryResult = await query(
      'SELECT restaurant_id FROM categories WHERE id = ?',
      [category_id]
    );

    if (categoryResult.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const restaurant_id = categoryResult[0].restaurant_id;

    // Insert new menu item
    const result = await query(
      'INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, preparation_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [restaurant_id, category_id, name, description, price, image_url || null, preparation_time || 15]
    );

    // Get the created menu item
    const newMenuItem = await query(
      'SELECT * FROM menu_items WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      message: 'Menu item added successfully',
      menuItem: newMenuItem[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Add menu item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all menu items with category and restaurant info
    const menuItems = await query(`
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.preparation_time,
        mi.is_available,
        c.name as category_name,
        r.name as restaurant_name
      FROM menu_items mi
      JOIN categories c ON mi.category_id = c.id
      JOIN restaurants r ON mi.restaurant_id = r.id
      ORDER BY mi.created_at DESC
    `);

    return NextResponse.json({
      menuItems: menuItems
    });

  } catch (error) {
    console.error('Get menu items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, price, category_id, image_url, preparation_time, is_available } = await request.json();

    if (!id || !name || !description || !price || !category_id) {
      return NextResponse.json(
        { error: 'ID, name, description, price, and category are required' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Update menu item
    await query(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, preparation_time = ?, is_available = ? WHERE id = ?',
      [name, description, price, category_id, image_url || null, preparation_time || 15, is_available !== false, id]
    );

    // Get the updated menu item
    const updatedMenuItem = await query(
      'SELECT mi.*, c.name as category_name, r.name as restaurant_name FROM menu_items mi JOIN categories c ON mi.category_id = c.id JOIN restaurants r ON mi.restaurant_id = r.id WHERE mi.id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Menu item updated successfully',
      menuItem: updatedMenuItem[0]
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
        { error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    // Check if menu item exists
    const existingItem = await query('SELECT id FROM menu_items WHERE id = ?', [id]);
    
    if (existingItem.length === 0) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Delete menu item
    await query('DELETE FROM menu_items WHERE id = ?', [id]);

    return NextResponse.json({
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Delete menu item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
