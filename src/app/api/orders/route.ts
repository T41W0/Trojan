import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateOrderNumber, calculateDistance, calculateDeliveryFee, calculateDeliveryTime } from '@/lib/utils';
import Stripe from 'stripe';
import { emitOrderUpdate, emitPaymentUpdate } from '@/lib/socket';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      restaurant_id,
      items,
      delivery_address,
      delivery_latitude,
      delivery_longitude,
      user_info,
      notes
    } = body;

    // Validate required fields
    const missingFields = [];
    if (!restaurant_id) missingFields.push('restaurant_id');
    if (!items || !Array.isArray(items) || items.length === 0) missingFields.push('items');
    if (!delivery_address) missingFields.push('delivery_address');
    if (!user_info) missingFields.push('user_info');
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      console.log('Received data:', { restaurant_id, items, delivery_address, user_info });
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure numeric values are properly converted
    const lat = delivery_latitude ? parseFloat(delivery_latitude) : 0;
    const lng = delivery_longitude ? parseFloat(delivery_longitude) : 0;

    // Get restaurant details
    const restaurantSql = 'SELECT * FROM restaurants WHERE id = ? AND is_active = 1';
    const restaurants = await query(restaurantSql, [restaurant_id]);
    
    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const restaurant = restaurants[0];

    // Calculate distance and delivery fee
    const distance = calculateDistance(
      parseFloat(restaurant.latitude),
      parseFloat(restaurant.longitude),
      lat,
      lng
    );

    const deliveryFee = calculateDeliveryFee(distance, 2.0, restaurant.delivery_fee_per_km);
    
    // Calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItemSql = 'SELECT * FROM menu_items WHERE id = ? AND is_available = 1';
      const menuItems = await query(menuItemSql, [item.menu_item_id]);
      
      if (!menuItems || menuItems.length === 0) {
        return NextResponse.json(
          { success: false, error: `Menu item ${item.menu_item_id} not found` },
          { status: 404 }
        );
      }

      const menuItem = menuItems[0];
      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem.price,
        total_price: itemTotal,
        special_instructions: item.special_instructions || ''
      });
    }

    const totalAmount = subtotal + deliveryFee;
    const orderNumber = generateOrderNumber();

    // Create or get user
    let userId = null;
    if (user_info.email) {
      const userSql = 'SELECT id FROM users WHERE email = ?';
      const existingUsers = await query(userSql, [user_info.email]);
      
      if (existingUsers && existingUsers.length > 0) {
        userId = existingUsers[0].id;
        
        // Update user info
        const updateUserSql = `
          UPDATE users 
          SET name = ?, phone = ?, default_address = ?, default_latitude = ?, default_longitude = ?
          WHERE id = ?
        `;
        await query(updateUserSql, [
          user_info.name || '',
          user_info.phone || null,
          delivery_address,
          lat,
          lng,
          userId
        ]);
      } else {
        // Create new user
        const createUserSql = `
          INSERT INTO users (name, email, phone, default_address, default_latitude, default_longitude)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const userResult = await query(createUserSql, [
          user_info.name || '',
          user_info.email || '',
          user_info.phone || null,
          delivery_address,
          lat,
          lng
        ]);
        userId = (userResult as any).insertId;
      }
    }

    // Calculate estimated delivery time
    const preparationTime = restaurant.preparation_time;
    const estimatedDeliveryTime = calculateDeliveryTime(distance, preparationTime);

    // Create order
    const orderSql = `
      INSERT INTO orders (
        user_id, restaurant_id, order_number, subtotal, delivery_fee, total_amount,
        delivery_address, delivery_latitude, delivery_longitude, distance_km,
        estimated_delivery_time, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderResult = await query(orderSql, [
      userId,
      restaurant_id,
      orderNumber,
      subtotal,
      deliveryFee,
      totalAmount,
      delivery_address,
      lat,
      lng,
      distance,
      new Date(Date.now() + estimatedDeliveryTime * 60000).toISOString(),
      notes || null
    ]);

    const orderId = (orderResult as any).insertId;

    // Create order items
    for (const item of orderItems) {
      const orderItemSql = `
        INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, special_instructions)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await query(orderItemSql, [
        orderId,
        item.menu_item_id,
        item.quantity,
        item.unit_price,
        item.total_price,
        item.special_instructions
      ]);
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to pence
      currency: 'gbp',
      metadata: {
        order_id: orderId.toString(),
        order_number: orderNumber,
        restaurant_id: restaurant_id.toString()
      },
    });

    // Update order with payment intent ID
    const updateOrderSql = 'UPDATE orders SET payment_intent_id = ? WHERE id = ?';
    await query(updateOrderSql, [paymentIntent.id, orderId]);

    // Emit real-time order update
    emitOrderUpdate(orderId.toString(), {
      order_id: orderId,
      status: 'pending',
      message: 'Order created successfully'
    });

    return NextResponse.json({
      success: true,
      data: {
        order_id: orderId,
        order_number: orderNumber,
        client_secret: paymentIntent.client_secret,
        total_amount: totalAmount,
        estimated_delivery_time: estimatedDeliveryTime,
        delivery_fee: deliveryFee,
        distance: distance
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('order_number');
    const email = searchParams.get('email');

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    const orderSql = `
      SELECT o.*, r.name as restaurant_name, r.address as restaurant_address,
             r.phone as restaurant_phone
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.order_number = ? AND o.user_id IN (
        SELECT id FROM users WHERE email = ?
      )
    `;

    const orders = await query(orderSql, [orderNumber, email]);

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orders[0];

    // Get order items
    const itemsSql = `
      SELECT oi.*, mi.name as item_name, mi.image_url
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `;

    const orderItems = await query(itemsSql, [order.id]);

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items: orderItems
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
