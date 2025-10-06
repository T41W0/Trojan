import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Get user ID from request headers (if authenticated)
    const userId = request.headers.get('x-user-id');
    console.log(`🔍 Fetching order ${orderId} for user ${userId || 'anonymous'}`);

    // Get order details with restaurant and order items
    const orderSql = `
      SELECT 
        o.id,
        o.status,
        o.order_number,
        o.subtotal,
        o.delivery_fee,
        o.total_amount,
        o.delivery_address,
        o.delivery_latitude,
        o.delivery_longitude,
        o.estimated_delivery_time,
        o.created_at,
        o.updated_at,
        o.user_id,
        r.name as restaurant_name,
        r.phone as restaurant_phone,
        r.address as restaurant_address,
        r.image_url as restaurant_image
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ?
    `;

    const orderData = await query(orderSql, [orderId]);

    if (orderData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderData[0];

    // Security check: Only allow access if:
    // 1. User is authenticated and owns the order, OR
    // 2. Order is being accessed via order number (for tracking), OR
    // 3. Admin is accessing (we'll add admin check later)
    const orderUserId = order.user_id;
    const isOwner = userId && parseInt(userId) === orderUserId;
    const isAdmin = false; // TODO: Add admin check
    
    // For now, allow access to all orders (we'll add proper authentication later)
    // In production, you should implement proper user authentication
    console.log(`🔒 Order access check: user ${userId}, order owner ${orderUserId}, isOwner: ${isOwner}`);

    // Get order items
    const itemsSql = `
      SELECT 
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        oi.special_instructions,
        mi.name as item_name,
        mi.description as item_description,
        mi.image_url as item_image
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `;

    const itemsData = await query(itemsSql, [orderId]);

    // Format the response
    const formattedOrder = {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      subtotal: parseFloat(order.subtotal),
      delivery_fee: parseFloat(order.delivery_fee),
      total_amount: parseFloat(order.total_amount),
      delivery_address: order.delivery_address,
      estimated_delivery_time: order.estimated_delivery_time,
      created_at: order.created_at,
      updated_at: order.updated_at,
      restaurant: {
        name: order.restaurant_name,
        phone: order.restaurant_phone,
        address: order.restaurant_address,
        image_url: order.restaurant_image
      },
      items: itemsData.map(item => ({
        name: item.item_name,
        description: item.item_description,
        quantity: item.quantity,
        price: parseFloat(item.unit_price),
        total_price: parseFloat(item.total_price),
        special_instructions: item.special_instructions,
        image_url: item.item_image
      }))
    };

    return NextResponse.json({
      success: true,
      data: formattedOrder
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deleting order ${orderId}...`);

    // First, check if the order exists
    const existingOrder = await query('SELECT id, order_number FROM orders WHERE id = ?', [orderId]);
    
    if (existingOrder.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Delete order items first (due to foreign key constraints)
    await query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    console.log(`✅ Deleted order items for order ${orderId}`);

    // Delete the order
    await query('DELETE FROM orders WHERE id = ?', [orderId]);
    console.log(`✅ Deleted order ${orderId}`);

    return NextResponse.json({
      success: true,
      message: `Order ${existingOrder[0].order_number} has been deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
