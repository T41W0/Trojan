import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Fetching orders for admin panel...');
    
    // First, let's check if orders table exists and has data
    const countResult = await query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = countResult[0]?.count || 0;
    console.log('📊 Total orders in database:', totalOrders);
    
    if (totalOrders === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: 'No orders found in database'
      });
    }
    
    // Fetch recent orders with customer info
    const orderRows = await query(
      `SELECT 
        o.id,
        o.status,
        o.order_number,
        o.total_amount,
        o.created_at,
        o.delivery_address,
        o.user_id,
        r.name as restaurant_name,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone
       FROM orders o
       LEFT JOIN restaurants r ON o.restaurant_id = r.id
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 50`
    );

    console.log('📊 Raw order data type:', typeof orderRows);
    console.log('📊 Raw order data length:', orderRows?.length);
    
    // Handle different database response formats
    let orders = [];
    if (Array.isArray(orderRows)) {
      // Direct array response
      orders = orderRows;
    } else if (orderRows && Array.isArray(orderRows[0])) {
      // Nested array response
      orders = orderRows[0];
    } else if (orderRows && typeof orderRows === 'object' && !Array.isArray(orderRows)) {
      // Single object response
      orders = [orderRows];
    } else {
      console.log('⚠️ Unexpected order data format:', orderRows);
      orders = [];
    }
    
    console.log('📋 Processed orders:', orders.length);

    // Format orders with customer info from users table
    const formattedOrders = orders.map((order: any, index: number) => {
      console.log(`📋 Processing order ${index + 1}:`, {
        id: order.id,
        status: order.status,
        order_number: order.order_number,
        total_amount: order.total_amount,
        customer_name: order.customer_name,
        customer_email: order.customer_email
      });

      const formattedOrder = {
        id: order.id,
        order_number: order.order_number || `#${order.id}`,
        status: order.status || 'pending',
        total_amount: parseFloat(order.total_amount || 0),
        created_at: order.created_at,
        customer_name: order.customer_name || 'Guest',
        customer_email: order.customer_email || '',
        customer_phone: order.customer_phone || '',
        delivery_address: order.delivery_address,
        restaurant_name: order.restaurant_name || 'Tega\'s Restaurant',
        user_id: order.user_id
      };
      
      console.log(`✅ Formatted order ${index + 1}:`, formattedOrder);
      return formattedOrder;
    });

    console.log('✅ Total formatted orders:', formattedOrders.length);
    
    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      total_count: totalOrders,
      processed_count: formattedOrders.length
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
