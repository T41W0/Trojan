import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { NotificationService } from '@/lib/notificationService';
import { emitOrderUpdate } from '@/lib/socket';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Valid status values
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update order status in database
    await query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    // Get updated order details with customer info
    const orderRows = await query(
      `SELECT o.*, r.name as restaurant_name, r.phone as restaurant_phone, r.address as restaurant_address,
              u.email as customer_email, u.phone as customer_phone
       FROM orders o
       LEFT JOIN restaurants r ON o.restaurant_id = r.id
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );

    const order = Array.isArray(orderRows) ? orderRows[0] : orderRows;

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get order items
    const itemRows = await query(
      `SELECT oi.*, mi.name, mi.price
       FROM order_items oi
       LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = ?`,
      [id]
    );

    const items = Array.isArray(itemRows) ? itemRows : [];

    // Format order data
    const orderData = {
      id: order.id,
      status: order.status,
      restaurant: {
        name: order.restaurant_name,
        phone: order.restaurant_phone,
        address: order.restaurant_address
      },
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      })),
      total_amount: parseFloat(order.total_amount),
      estimated_delivery_time: order.estimated_delivery_time,
      delivery_address: order.delivery_address,
      created_at: order.created_at
    };

    // Emit socket event for real-time updates
    try {
      emitOrderUpdate(id, {
        status: order.status,
        orderNumber: order.order_number,
        updatedAt: new Date().toISOString()
      });
      console.log('📡 Socket event emitted for order status update');
    } catch (socketError) {
      console.error('❌ Error emitting socket event:', socketError);
      // Don't fail the request if socket emission fails
    }

    // Send notifications for status update
    try {
      await NotificationService.sendOrderUpdateNotification({
        orderId: order.id.toString(),
        orderNumber: order.order_number || `#${order.id}`,
        status: order.status,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        restaurantName: order.restaurant_name
      });
      console.log('✅ Notifications sent for order status update');
    } catch (notificationError) {
      console.error('❌ Error sending notifications:', notificationError);
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({
      success: true,
      data: orderData
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

// Auto-progress order status (for testing)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { delay = 3000 } = await request.json(); // Default 3 seconds between status updates

    // Get current order status
    const orderRows = await query(
      'SELECT status FROM orders WHERE id = ?',
      [id]
    );

    const order = Array.isArray(orderRows) ? orderRows[0] : orderRows;

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Define status progression
    const statusProgression = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = statusProgression.indexOf(order.status);
    
    if (currentIndex === -1 || currentIndex >= statusProgression.length - 1) {
      return NextResponse.json({
        success: false,
        error: 'Order is already at final status or invalid status'
      });
    }

    // Start auto-progression
    const progressOrder = async () => {
      for (let i = currentIndex + 1; i < statusProgression.length; i++) {
        const newStatus = statusProgression[i];
        
        // Update status in database
        await query(
          'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
          [newStatus, id]
        );

        console.log(`Order ${id} status updated to: ${newStatus}`);

        // Wait before next status update
        if (i < statusProgression.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

    // Start progression in background
    progressOrder();

    return NextResponse.json({
      success: true,
      message: 'Order status progression started',
      currentStatus: order.status,
      nextStatus: statusProgression[currentIndex + 1]
    });

  } catch (error) {
    console.error('Error starting order progression:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start order progression' },
      { status: 500 }
    );
  }
}