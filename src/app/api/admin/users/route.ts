import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const users = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.is_active, u.created_at,
              COUNT(o.id) as total_orders
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    return NextResponse.json({
      users: users
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, role, is_active } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user role if provided
    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }

      await query(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, userId]
      );
    }

    // Update user status if provided
    if (is_active !== undefined) {
      await query(
        'UPDATE users SET is_active = ? WHERE id = ?',
        [is_active, userId]
      );
    }

    // Get updated user
    const updatedUsers = await query(
      'SELECT id, name, email, phone, role, is_active, default_address FROM users WHERE id = ?',
      [userId]
    );

    const message = role !== undefined && is_active !== undefined 
      ? 'User updated successfully'
      : role !== undefined 
      ? 'User role updated successfully'
      : 'User status updated successfully';

    return NextResponse.json({
      message: message,
      user: updatedUsers[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
