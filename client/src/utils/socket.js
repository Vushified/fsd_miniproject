import { io } from 'socket.io-client';

// Section 8: WebSocket client setup with Socket.IO
// Connects to Express Socket.IO server for instant order updates & live notifications
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Connect on demand
  transports: ['websocket', 'polling'],
});

