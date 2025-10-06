import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.order_id;
  
  if (!orderId) {
    console.error('No order_id in payment intent metadata');
    return;
  }

  // Update order payment status
  const updatePaymentSql = `
    UPDATE orders 
    SET payment_status = 'paid', status = 'confirmed', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;
  
  await query(updatePaymentSql, [orderId]);
  
  console.log(`Payment successful for order ${orderId}`);
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.order_id;
  
  if (!orderId) {
    console.error('No order_id in payment intent metadata');
    return;
  }

  // Update order payment status
  const updatePaymentSql = `
    UPDATE orders 
    SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;
  
  await query(updatePaymentSql, [orderId]);
  
  console.log(`Payment failed for order ${orderId}`);
}
