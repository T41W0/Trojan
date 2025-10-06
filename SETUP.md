# Quick Setup Guide for Tega's Food

## 🚀 Getting Started

Follow these steps to get your food delivery website up and running:

### 1. Prerequisites
- Node.js 18+ installed
- MySQL server running on port 3307
- Stripe account for payments

### 2. Database Setup
```bash
# Connect to MySQL
mysql -u root -p

# Create database and run schema
source lib/database.sql
```

### 3. Environment Configuration
Create `.env.local` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tegas_food
DB_PORT=3307

# Stripe Configuration (get from Stripe Dashboard)
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install and Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Application
- **Customer Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## 🎯 Key Features

### For Customers:
- ✅ Browse restaurants near your location
- ✅ Add items to cart with special instructions
- ✅ Secure payment with Stripe
- ✅ Real-time order tracking
- ✅ Distance-based delivery fees

### For Admins:
- ✅ Dashboard with key metrics
- ✅ Order management
- ✅ Restaurant management
- ✅ Revenue tracking

## 🔧 Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Set up webhooks for payment processing
4. Add the keys to your `.env.local` file

## 📱 Testing the App

1. **Browse Restaurants**: Go to http://localhost:3000/restaurants
2. **Add to Cart**: Select items from any restaurant menu
3. **Checkout**: Complete the order with test card details
4. **Track Order**: Use the order number to track delivery

### Test Card Numbers (Stripe Test Mode):
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## 🎨 Customization

### Colors and Branding:
- Edit `src/app/globals.css` for color schemes
- Update logo and branding in `src/components/Header.tsx`

### Delivery Settings:
- Modify delivery fees in `lib/utils.ts`
- Adjust preparation times in the database

### Restaurant Data:
- Add more restaurants in `lib/database.sql`
- Update menu items and categories

## 🚀 Deployment

### Vercel (Recommended):
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms:
- Netlify, Railway, or any Next.js compatible platform
- Ensure MySQL database is accessible from the deployment platform

## 🆘 Troubleshooting

### Common Issues:

**Database Connection Error:**
- Check MySQL is running on port 3307
- Verify database credentials in `.env.local`
- Ensure database `tegas_food` exists

**Stripe Payment Issues:**
- Verify Stripe keys are correct
- Check webhook endpoint is configured
- Ensure using test keys in development

**Build Errors:**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version is 18+

## 📞 Support

If you encounter any issues:
1. Check the main README.md for detailed documentation
2. Verify all environment variables are set correctly
3. Ensure MySQL server is running and accessible

---

**Happy coding! 🍕✨**
