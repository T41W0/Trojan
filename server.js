const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: dev ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join order room for real-time updates
    socket.on('join-order', (orderId) => {
      socket.join(`order-${orderId}`);
      console.log(`User ${socket.id} joined order room: ${orderId}`);
    });

    // Join user room for user-specific updates
    socket.on('join-user', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${socket.id} joined user room: ${userId}`);
    });

    // Leave rooms
    socket.on('leave-order', (orderId) => {
      socket.leave(`order-${orderId}`);
      console.log(`User ${socket.id} left order room: ${orderId}`);
    });

    socket.on('leave-user', (userId) => {
      socket.leave(`user-${userId}`);
      console.log(`User ${socket.id} left user room: ${userId}`);
    });

    // Handle payment step updates
    socket.on('payment-step', (data) => {
      console.log('Payment step update:', data);
      // Broadcast to order room
      socket.to(`order-${data.order_id}`).emit('payment-update', {
        type: 'payment_processing',
        step: data.step,
        total_steps: data.total_steps,
        message: data.message,
        order_id: data.order_id
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Make io available globally for API routes
  global.io = io;

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
