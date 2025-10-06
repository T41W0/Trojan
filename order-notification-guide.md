# 🔔 Order Notification System - Complete Testing Guide

## 🎯 Overview
This guide shows you how to test the complete order notification system, from placing an order to receiving real-time status updates.

## 📋 Prerequisites
1. **Server Running**: Make sure `npm run dev` is running
2. **Browser Notifications**: Enable browser notifications when prompted
3. **Admin Access**: You need admin access to update order statuses

## 🚀 Step-by-Step Testing Process

### **Step 1: Place an Order**
1. **Go to Restaurant**: Visit `http://localhost:3000/restaurants`
2. **Add Items**: Add some items to your cart
3. **Proceed to Cart**: Click "View Cart" or cart icon
4. **Fill Delivery Info**: Add your delivery address and phone
5. **Checkout**: Click "Proceed to Checkout"
6. **Payment**: Complete the payment process
7. **Note Order ID**: Save the order ID that appears after payment

### **Step 2: Check Admin Panel**
1. **Go to Admin**: Visit `http://localhost:3000/admin`
2. **Login as Admin**: Use admin credentials
3. **View Orders**: Look at the "Recent Orders" section
4. **Verify Order**: Your new order should appear in the list
5. **Refresh if Needed**: Click "Refresh Orders" button

### **Step 3: Update Order Status**
1. **Find Your Order**: Locate your order in the admin table
2. **Change Status**: Use the dropdown in the "Actions" column
3. **Select Status**: Choose from:
   - Pending → Confirmed
   - Confirmed → Preparing
   - Preparing → Ready
   - Ready → Out for Delivery
   - Out for Delivery → Delivered

### **Step 4: Check Notifications**
When you update the order status, you should receive:

#### **Browser Notifications**
- Popup notification appears
- Shows order number and new status
- Click to focus on the app

#### **Toast Notifications**
- In-app notification at bottom of screen
- Confirms status update

#### **Real-time Updates**
- If tracking the order page, status updates immediately
- No page refresh needed

## 🧪 Advanced Testing

### **Test All Notification Types**

#### **1. Browser Notification Test**
```bash
# Open browser console and run:
fetch('/api/orders/1/status', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'preparing' })
})
```

#### **2. Full Order Flow Simulation**
1. Go to `http://localhost:3000/order-notification-test.html`
2. Click "Simulate Full Order Flow"
3. Watch notifications appear automatically

#### **3. Manual Status Updates**
```bash
# Update order to confirmed
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'

# Update order to preparing
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"preparing"}'

# Update order to delivered
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"delivered"}'
```

## 📱 Notification Types Explained

### **Order Status Messages**

| Status | Message | When Sent |
|--------|---------|-----------|
| **Pending** | "Your order has been placed and is being processed" | After payment |
| **Confirmed** | "Great news! Your order has been confirmed and is being prepared" | Admin confirms |
| **Preparing** | "Your order is being prepared in the kitchen" | Kitchen starts |
| **Ready** | "Your order is ready for pickup!" | Food ready |
| **Out for Delivery** | "Your order is out for delivery and on its way!" | Driver dispatched |
| **Delivered** | "Your order has been delivered. Enjoy your meal!" | Delivered |

### **Notification Channels**

1. **Browser Notifications** - Popup notifications (requires permission)
2. **Toast Notifications** - In-app notifications (always works)
3. **Email Notifications** - Email updates (mock implementation)
4. **SMS Notifications** - Text message updates (mock implementation)

## 🔧 Troubleshooting

### **Orders Not Showing in Admin**
- **Check API**: Visit `http://localhost:3000/api/admin/orders`
- **Refresh Admin**: Click "Refresh Orders" button
- **Check Database**: Ensure orders table has data
- **Verify Order Creation**: Check if order was actually created

### **Notifications Not Working**
- **Check Permission**: Browser notification permission granted?
- **Check Console**: Look for JavaScript errors
- **Test API**: Verify status update API is working
- **Check Network**: Ensure API calls are successful

### **Status Updates Not Reflecting**
- **Check Database**: Verify status was updated in database
- **Refresh Page**: Try refreshing the admin page
- **Check API Response**: Verify API returned success
- **Check Real-time**: Ensure WebSocket connection is working

## 📊 Expected Behavior

### **After Placing Order**
1. ✅ Order appears in admin panel immediately
2. ✅ Order status shows as "pending"
3. ✅ Customer gets confirmation notification

### **After Status Update**
1. ✅ Admin sees updated status in dropdown
2. ✅ Customer gets browser notification
3. ✅ Toast notification appears
4. ✅ Order tracking page updates in real-time
5. ✅ Email/SMS notifications sent (logged to console)

### **Admin Panel Features**
1. ✅ Real orders from database (not mock data)
2. ✅ Status dropdown for each order
3. ✅ Refresh button to reload orders
4. ✅ Empty state when no orders
5. ✅ Real-time statistics

## 🎉 Success Indicators

You'll know the system is working when:

- ✅ **Orders appear in admin panel** after placement
- ✅ **Status updates work** via dropdown
- ✅ **Notifications appear** when status changes
- ✅ **Real-time updates** work on tracking page
- ✅ **Statistics update** based on real data

## 🚀 Next Steps

Once basic testing is complete:

1. **Test with Multiple Orders**: Place several orders
2. **Test Different Statuses**: Try all status combinations
3. **Test Real-time Updates**: Open multiple browser tabs
4. **Test Mobile**: Try on mobile devices
5. **Test Email/SMS**: Implement real email/SMS services

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check server terminal for API errors
3. Verify database has order data
4. Test API endpoints directly
5. Check notification permissions

---

**Happy Testing! 🎉**

The notification system ensures customers always know the status of their orders, providing a great user experience and reducing support inquiries.
