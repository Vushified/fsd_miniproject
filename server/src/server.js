import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB (Section 5)
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS (Section 8: Real-Time WebSockets)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach io to express app so controllers can emit events
app.set('socketio', io);

// In-memory synced live orders across all browser sessions (Customer, Vendor, Driver)
let sharedLiveOrders = [
  {
    id: 'ORD-9281',
    customerName: 'Vidushi Singh',
    customerPhone: '+91 98765 43210',
    storeId: 'store-1',
    storeName: 'Fresh Basket QuickMart',
    items: [
      { id: 'prod-1', name: 'Tata Sampann High Protein Toor Dal', quantity: 1, price: 185, available: true },
      { id: 'prod-2', name: 'Fortune Sunlite Refined Sunflower Oil', quantity: 2, price: 145, available: true },
      { id: 'prod-4', name: 'Amul Taaza Milk 500ml', quantity: 2, price: 33, available: true },
    ],
    totalAmount: 541,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Packing',
    deliveryAddress: 'Flat 402, Sea Breeze Apts, Bandra West, Mumbai 400050',
    driverName: 'Ramesh Sharma',
    driverPhone: '+91 91234 56789',
    createdAt: '10:40 AM',
    estimatedTime: '8 mins',
    missingItemRefund: null,
  },
  {
    id: 'ORD-9282',
    customerName: 'Aarav Patel',
    customerPhone: '+91 98222 33445',
    storeId: 'store-1',
    storeName: 'Fresh Basket QuickMart',
    items: [
      { id: 'prod-3', name: 'Aashirvaad Shudh Chakki Atta 5kg', quantity: 1, price: 245, available: true },
    ],
    totalAmount: 157,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Placed',
    deliveryAddress: '12th Floor, Blue Horizon, Khar West, Mumbai',
    driverName: 'Ramesh Sharma',
    driverPhone: '+91 91234 56789',
    createdAt: '10:48 AM',
    estimatedTime: '14 mins',
    missingItemRefund: null,
  },
];

// Socket.IO Connection & Disconnection Handling (Section 8)
io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  // Send current live orders immediately on connection
  socket.emit('orders:sync', sharedLiveOrders);

  // Broadcast new placed order to vendor & driver in real-time
  socket.on('order:new', (order) => {
    console.log(`[WebSocket] New order received: ${order.id}`);
    sharedLiveOrders = [order, ...sharedLiveOrders.filter((o) => o.id !== order.id)];
    io.emit('order:created', order);
  });

  // Broadcast order status change to all connected clients (Customer, Vendor, Driver)
  socket.on('order:update_status', (data) => {
    console.log(`[WebSocket] Emitting order status update: Order ${data.orderId} -> ${data.status}`);
    sharedLiveOrders = sharedLiveOrders.map((ord) =>
      ord.id === data.orderId ? { ...ord, ...data.updatedOrder, status: data.status } : ord
    );
    io.emit('order:status_updated', data);
  });

  // Broadcast out-of-stock item & customer refund
  socket.on('order:mark_outofstock', (data) => {
    console.log(`[WebSocket] Emitting refund: Order ${data.orderId}`);
    io.emit('order:refund_processed', data);
  });

  // Broadcast store online/offline status
  socket.on('store:status_change', (data) => {
    io.emit('store:status_changed', data);
  });

  // Driver location ping event
  socket.on('driver:location_update', (data) => {
    io.emit('driver:location_changed', data);
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development (Section 6: Proper logging)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'QuickDrop API',
  });
});

// Mount REST API Routes (Section 4)
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handling Middleware (Section 6)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[QuickDrop Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

