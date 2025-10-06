import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    
    console.log(`🔍 Tracking order with number: ${orderNumber}`);

    if (!orderNumber || orderNumber.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid order number' },
        { status: 400 }
      );
    }

    // Get order details by order number
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
      WHERE o.order_number = ?
    `;

    const orderData = await query(orderSql, [orderNumber]);

    if (orderData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found. Please check your order number.' },
        { status: 404 }
      );
    }

    const order = orderData[0];

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

    const itemsData = await query(itemsSql, [order.id]);

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

    console.log(`✅ Order found: ${order.order_number}, Status: ${order.status}`);

    return NextResponse.json({
      success: true,
      data: formattedOrder
    });

  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track order' },
      { status: 500 }
    );
  }
}
