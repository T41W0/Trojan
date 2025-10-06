import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all categories with restaurant info
    const categories = await query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.display_order,
        r.name as restaurant_name
      FROM categories c
      JOIN restaurants r ON c.restaurant_id = r.id
      ORDER BY c.display_order
    `);

    return NextResponse.json({
      categories: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
