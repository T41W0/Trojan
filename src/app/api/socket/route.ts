import { NextRequest, NextResponse } from 'next/server';
import { emitOrderUpdate, emitPaymentUpdate, emitUserNotification } from '@/lib/socket';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, orderId, userId, data } = body;

    switch (type) {
      case 'order-update':
        if (orderId) {
          emitOrderUpdate(orderId, data);
        }
        break;
      
      case 'payment-update':
        if (orderId) {
          emitPaymentUpdate(orderId, data);
        }
        break;
      
      case 'user-notification':
        if (userId) {
          emitUserNotification(userId, data);
        }
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Event emitted successfully'
    });

  } catch (error) {
    console.error('Error emitting WebSocket event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to emit event' },
      { status: 500 }
    );
  }
}
