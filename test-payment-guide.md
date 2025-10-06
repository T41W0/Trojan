# 🧪 Payment & Order Tracking Test Guide

## **How to Test Your Payment System**

### **Step 1: Start the Development Server**
```bash
npm run dev
```

### **Step 2: Test the Complete Flow**

#### **A. Add Items to Cart**
1. Go to `http://localhost:3000`
2. Navigate to Tega's Restaurant
3. Add some Nigerian dishes to your cart
4. Go to cart page (`/cart`)

#### **B. Fill Delivery Information**
1. Enter your delivery address (or use current location)
2. Fill in your contact details with country code
3. Verify delivery fee is calculated
4. Click "Proceed to Checkout"

#### **C. Test Payment Process**
1. You'll be redirected to `/checkout?order_id=XXX&client_secret=XXX`
2. Fill in test card details:
   - **Card Number**: `4242 4242 4242 4242` (Stripe test card)
   - **Expiry**: `12/25`
   - **CVV**: `123`
   - **Name**: `Test User`
3. Click "Pay £XX.XX"
4. Watch the real-time payment processing steps

#### **D. Test Order Tracking**
1. After successful payment, you'll be redirected to `/orders/XXX`
2. You should see real-time order status updates
3. Test the "Call Restaurant" and "Contact Support" buttons

---

## **Test Card Numbers (Stripe Test Cards)**

### **Successful Payments:**
- `4242 4242 4242 4242` - Visa
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

### **Failed Payments:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds
- `4000 0000 0000 0069` - Expired card

---

## **Testing Different Scenarios**

### **Scenario 1: Successful Order**
1. Add items to cart
2. Use current location for delivery
3. Pay with `4242 4242 4242 4242`
4. Verify order tracking page loads
5. Check real-time status updates

### **Scenario 2: Payment Failure**
1. Add items to cart
2. Use test card `4000 0000 0000 0002`
3. Verify error handling
4. Try again with valid card

### **Scenario 3: Location Services**
1. Test with location permission granted
2. Test with location permission denied
3. Test manual address entry
4. Verify delivery fee calculation

### **Scenario 4: Mobile Testing**
1. Test on mobile device
2. Verify responsive design
3. Test touch interactions
4. Check country code selector

---

## **Debugging Tips**

### **Check Browser Console**
- Open DevTools (F12)
- Look for JavaScript errors
- Check Network tab for failed API calls
- Monitor WebSocket connections

### **Check Server Logs**
- Look for database connection issues
- Check API endpoint responses
- Verify Socket.IO connections

### **Common Issues & Solutions**

#### **Issue: "Order not found"**
- **Solution**: Check if order was created in database
- **Debug**: Check `/api/orders` endpoint

#### **Issue: Payment not processing**
- **Solution**: Check Socket.IO connection
- **Debug**: Verify WebSocket server is running

#### **Issue: Location not working**
- **Solution**: Check browser permissions
- **Debug**: Test with HTTPS (some browsers require it)

#### **Issue: Delivery fee not calculating**
- **Solution**: Check restaurant coordinates in database
- **Debug**: Verify geocoding API calls

---

## **API Endpoints to Test**

### **Order Creation**
```
POST /api/orders
```

### **Order Retrieval**
```
GET /api/orders/{id}
```

### **Payment Processing**
```
POST /api/orders (with payment data)
```

### **WebSocket Events**
- `payment-update`
- `order-update`
- `payment-step`

---

## **Database Queries to Check**

### **Check Orders Table**
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```

### **Check Order Items**
```sql
SELECT oi.*, mi.name as item_name 
FROM order_items oi 
JOIN menu_items mi ON oi.menu_item_id = mi.id 
WHERE oi.order_id = 'YOUR_ORDER_ID';
```

### **Check Restaurant Data**
```sql
SELECT * FROM restaurants WHERE id = 1;
```

---

## **Real-time Features to Test**

### **Payment Processing**
- Real-time payment steps
- Connection status indicator
- Success/failure notifications

### **Order Tracking**
- Order status updates
- Real-time notifications
- Progress indicators

### **WebSocket Connection**
- Connection status
- Automatic reconnection
- Event handling

---

## **Performance Testing**

### **Load Testing**
- Multiple simultaneous orders
- WebSocket connection limits
- Database performance

### **Error Handling**
- Network disconnection
- Payment failures
- Invalid data

---

## **Mobile Testing Checklist**

- [ ] Touch interactions work
- [ ] Country code selector is usable
- [ ] Location services work
- [ ] Payment form is accessible
- [ ] Order tracking is readable
- [ ] Real-time updates work

---

## **Production Readiness**

### **Security**
- [ ] HTTPS enabled
- [ ] Payment data encrypted
- [ ] API endpoints secured
- [ ] Input validation

### **Performance**
- [ ] Database optimized
- [ ] WebSocket scaling
- [ ] Error monitoring
- [ ] Logging implemented

---

## **Quick Test Commands**

```bash
# Start development server
npm run dev

# Check if database is connected
node -e "require('./src/lib/db').query('SELECT 1')"

# Test API endpoints
curl http://localhost:3000/api/restaurants
curl http://localhost:3000/api/orders

# Check WebSocket connection
# Open browser console and check for Socket.IO connection
```

---

## **Success Indicators**

✅ **Payment System Working:**
- Test cards process successfully
- Real-time payment steps display
- Order confirmation received
- Cart clears after payment

✅ **Order Tracking Working:**
- Order page loads with details
- Real-time status updates
- Restaurant contact info displays
- Order history shows correctly

✅ **Location Services Working:**
- Current location detected
- Address geocoding works
- Delivery fee calculates correctly
- Manual address entry works

✅ **Mobile Experience:**
- Responsive design works
- Touch interactions smooth
- Country code selector usable
- Forms accessible on mobile
