# Tega's Food - Food Delivery Website

A modern food delivery website built with Next.js, Tailwind CSS, and MySQL. Users can browse restaurants, place orders, and track deliveries with real-time updates.

## Features

- 🍕 **Restaurant Browsing**: Discover restaurants near your location
- 🛒 **Shopping Cart**: Add items from multiple categories with special instructions
- 💳 **Secure Payments**: Stripe integration for secure card payments
- 📍 **Location-based Delivery**: Distance calculation and dynamic delivery fees
- ⏱️ **Real-time Tracking**: Track your order from preparation to delivery
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Payments**: Stripe
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- MySQL server running
- Stripe account for payments
- Git installed

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tegas-food
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example environment file and fill in your details:
   ```bash
   cp config.env.example .env.local
   ```

   Update `.env.local` with your actual values:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=tegas_food
   DB_PORT=3307

   # Stripe Configuration
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

   # Delivery Configuration
   BASE_DELIVERY_FEE=2.00
   DELIVERY_FEE_PER_KM=1.50
   MIN_DELIVERY_TIME=15
   BASE_PREPARATION_TIME=10
   ```

4. **Set up the database**
   ```bash
   # Connect to your MySQL server
   mysql -u root -p

   # Run the database schema
   source lib/database.sql
   ```

5. **Run the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **restaurants**: Store restaurant information and location
- **categories**: Menu categories for each restaurant
- **menu_items**: Individual menu items with pricing
- **users**: Customer information and default addresses
- **orders**: Order details and status tracking
- **order_items**: Individual items within each order

## API Endpoints

### Restaurants
- `GET /api/restaurants` - Get restaurants near a location
- `GET /api/restaurants/[id]/menu` - Get restaurant menu
- `POST /api/restaurants` - Create new restaurant (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get order by number and email
- `PUT /api/orders/[id]/status` - Update order status
- `GET /api/orders/[id]/status` - Get order status

### Payments
- `POST /api/payment/webhook` - Stripe webhook for payment processing

## Key Features Explained

### Location-based Delivery
- Uses Haversine formula to calculate distance between restaurant and delivery address
- Dynamic delivery fees based on distance
- Estimated delivery time calculation

### Payment Integration
- Secure payment processing with Stripe
- Payment intent creation for orders
- Webhook handling for payment confirmation

### Order Tracking
- Real-time order status updates
- Visual progress indicators
- Estimated delivery time display

### Shopping Cart
- Persistent cart storage in localStorage
- Restaurant-specific ordering (one restaurant per cart)
- Quantity management and special instructions

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | MySQL host | Yes |
| `DB_USER` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_PORT` | MySQL port | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL for webhooks | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:
- Check the [FAQ](FAQ.md)
- Open an [issue](https://github.com/your-repo/issues)
- Contact support at support@tegasfood.com

## Roadmap

- [ ] Admin dashboard for restaurant management
- [ ] Push notifications for order updates
- [ ] Multi-language support
- [ ] Loyalty program integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app development

---

Made with ❤️ for food lovers everywhere!