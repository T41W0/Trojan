# 🚚 Order Tracking System Test Guide

## **How Order Tracking Works**

### **Order Status Progression:**
1. **Pending** - Order placed, waiting for confirmation
2. **Confirmed** - Restaurant has accepted the order
3. **Preparing** - Food is being prepared
4. **Ready** - Food is ready for pickup/delivery
5. **Out for Delivery** - Order is on the way
6. **Delivered** - Order has been delivered

---

## **🔧 Testing the Order Tracking System**

### **Method 1: Complete End-to-End Test**

#### **Step 1: Place an Order**
1. Go to `http://localhost:3000`
2. Navigate to Tega's Restaurant
3. Add Nigerian dishes to cart
4. Fill delivery information
5. Complete payment with test card: `4242 4242 4242 4242`
6. **IMPORTANT**: Note the Order ID from the checkout page (e.g., `TF-123456789`)

#### **Step 2: Access Order Simulator (Admin)**
1. Login as admin
2. Go to Admin Dashboard
3. Click "Order Simulator" tab
4. Find your order in the recent orders list
5. Select the order and click "Start Auto-Progression"

#### **Step 3: Track the Order**
1. Open a new tab and go to `/track-order`
2. Enter the Order ID you noted in Step 1
3. Watch real-time status updates as the order progresses

---

### **Method 2: Manual Status Updates**

#### **Step 1: Place an Order**
- Follow the same steps as Method 1, Step 1

#### **Step 2: Manual Status Updates**
1. Go to Admin Dashboard → Order Simulator
2. Select your order
3. Click on individual status buttons to manually update:
   - Pending → Confirmed
   - Confirmed → Preparing
   - Preparing → Ready
   - Ready → Out for Delivery
   - Out for Delivery → Delivered

#### **Step 3: Watch Updates**
- Keep the Track Order page open
- Update statuses manually and watch real-time updates

---

## **📍 How to Find Your Order ID**

### **After Payment Success:**
1. **Checkout Page**: Order ID is displayed prominently in the order summary
2. **Order Confirmation**: Should be shown in success message
3. **Database**: Check the orders table directly

### **If You Lost Your Order ID:**
1. Go to Admin Dashboard → Order Simulator
2. Look in the "Recent Orders" table
3. Copy the Order ID from there

---

## **🔍 Order Tracking Features**

### **Real-Time Updates:**
- ✅ WebSocket connection status indicator
- ✅ Live status updates without page refresh
- ✅ Estimated delivery time updates
- ✅ Order progress visualization

### **Order Details Displayed:**
- ✅ Order ID and status
- ✅ Restaurant information (name, phone, address)
- ✅ Order items and quantities
- ✅ Total amount
- ✅ Delivery address
- ✅ Creation time and last update

### **User Actions:**
- ✅ Call restaurant button
- ✅ Contact support button
- ✅ Track another order option

---

## **🐛 Troubleshooting**

### **Issue: "Order not found"**
**Solutions:**
1. Check if the order ID is correct (no extra spaces)
2. Verify the order exists in the database
3. Check if you're using the right Order ID format

### **Issue: No real-time updates**
**Solutions:**
1. Check WebSocket connection status (green dot = connected)
2. Refresh the page and try again
3. Check browser console for WebSocket errors
4. Ensure the development server is running

### **Issue: Status updates not working**
**Solutions:**
1. Check if the Order Simulator is working
2. Verify the API endpoints are responding
3. Check database for status updates
4. Restart the development server

---

## **📱 Mobile Testing**

### **Test on Mobile Device:**
1. Open the website on mobile
2. Place an order
3. Test the Track Order page
4. Verify real-time updates work
5. Test the call restaurant button

---

## **🎯 Success Indicators**

### **Order Tracking Working:**
- ✅ Order ID is easily accessible
- ✅ Track Order page loads with order details
- ✅ Real-time status updates work
- ✅ Status progression is smooth and logical
- ✅ All order information is displayed correctly

### **Admin Simulator Working:**
- ✅ Recent orders are displayed
- ✅ Manual status updates work
- ✅ Auto-progression works
- ✅ Status changes are reflected in tracking

---

## **🚀 Quick Test Commands**

```bash
# Start development server
npm run dev

# Check orders in database
node -e "
const db = require('./src/lib/db');
db.query('SELECT id, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5')
  .then(([rows]) => console.log('Recent orders:', rows))
  .catch(console.error);
"

# Test API endpoints
curl http://localhost:3000/api/admin/orders
curl http://localhost:3000/api/orders/ORDER_ID
```

---

## **📋 Test Checklist**

### **Order Placement:**
- [ ] Can place order successfully
- [ ] Order ID is displayed clearly
- [ ] Payment processing works
- [ ] Order appears in admin dashboard

### **Order Tracking:**
- [ ] Can access Track Order page
- [ ] Can enter Order ID successfully
- [ ] Order details load correctly
- [ ] Real-time updates work
- [ ] Status progression is smooth

### **Admin Controls:**
- [ ] Order Simulator loads recent orders
- [ ] Manual status updates work
- [ ] Auto-progression works
- [ ] Status changes reflect in tracking

### **Mobile Experience:**
- [ ] Track Order page works on mobile
- [ ] Real-time updates work on mobile
- [ ] Call restaurant button works
- [ ] Responsive design is good

---

## **💡 Pro Tips**

1. **Use Two Browser Tabs**: Keep the Order Simulator open in one tab and Track Order in another
2. **Test Different Statuses**: Try updating to different statuses to see all variations
3. **Check Console**: Open browser dev tools to monitor WebSocket connections
4. **Mobile Testing**: Test on actual mobile device for best results
5. **Multiple Orders**: Create multiple orders to test different scenarios

---

## **🎉 You're All Set!**

The order tracking system is now fully functional with:
- ✅ Easy Order ID access
- ✅ Dedicated Track Order page
- ✅ Real-time status updates
- ✅ Admin order simulator
- ✅ Mobile-responsive design
- ✅ Complete order lifecycle tracking

Start testing and enjoy watching your orders progress in real-time! 🚀
