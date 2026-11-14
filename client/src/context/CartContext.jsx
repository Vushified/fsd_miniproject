import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialOrders, initialStores, initialProducts, initialPendingVendors } from '../data/mockData';
import { socket } from '../utils/socket';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Cart items: [{ ...product, quantity }]
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('qd_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Stores and products state (allows live stock updates in vendor view)
  const [stores, setStores] = useState(initialStores);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [pendingVendors, setPendingVendors] = useState(initialPendingVendors);

  // Selected store ID currently being shopped from
  const [selectedStoreId, setSelectedStoreId] = useState('store-1');

  // Currently tracked order for View 4
  const [currentTrackingOrder, setCurrentTrackingOrder] = useState(() => initialOrders[0]);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'addr-1', label: 'Home', address: 'Flat 402, Sea Breeze Apts, Bandra West, Mumbai 400050', isDefault: true },
    { id: 'addr-2', label: 'College', address: 'Department of Computer Engineering, Campus Gate 2, Mumbai', isDefault: false },
  ]);

  // Selected delivery address
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);

  // Customer location selector for View 1
  const [customerLocation, setCustomerLocation] = useState('Bandra West, Mumbai');

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('qd_cart', JSON.stringify(cart));
  }, [cart]);

  // Section 8: Real-Time WebSockets via Socket.IO
  useEffect(() => {
    socket.connect();

    // Listen for live status change broadcasts
    socket.on('order:status_updated', (data) => {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === data.orderId ? { ...ord, ...data.updatedOrder, status: data.status } : ord))
      );
      if (currentTrackingOrder?.id === data.orderId) {
        setCurrentTrackingOrder((prev) => ({ ...prev, status: data.status }));
      }
    });

    // Listen for live item refund notifications
    socket.on('order:refund_processed', (data) => {
      if (currentTrackingOrder?.id === data.orderId) {
        setCurrentTrackingOrder((prev) => ({
          ...prev,
          totalAmount: data.newTotal,
          missingItemRefund: data.refund,
        }));
      }
    });

    // Clean up websocket listener on unmount
    return () => {
      socket.off('order:status_updated');
      socket.off('order:refund_processed');
      socket.disconnect();
    };
  }, [currentTrackingOrder?.id]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => setCart([]);

  // Calculate totals
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 200 || subtotal === 0 ? 0 : 25;
  const handlingFee = subtotal > 0 ? 5 : 0;
  const grandTotal = subtotal + deliveryFee + handlingFee;

  // Place order
  const placeOrder = ({ paymentMethod, deliveryAddress }) => {
    const store = stores.find((s) => s.id === selectedStoreId) || stores[0];
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Vidushi Singh',
      customerPhone: '+91 98765 43210',
      storeId: store.id,
      storeName: store.name,
      items: cart.map((item) => ({ ...item, available: true })),
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Placed', // Placed -> Packing -> Out for Delivery -> Delivered
      deliveryAddress: deliveryAddress.address,
      driverName: 'Ramesh Sharma',
      driverPhone: '+91 91234 56789',
      createdAt: 'Just now',
      estimatedTime: '10-15 mins',
      missingItemRefund: null,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentTrackingOrder(newOrder);
    clearCart();
    return newOrder;
  };

  // Update order status (used by Vendor and Driver dashboards)
  const updateOrderStatus = (orderId, newStatus, extraData = {}) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus, ...extraData };
          if (currentTrackingOrder?.id === orderId) {
            setCurrentTrackingOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
  };

  // Update product stock and price (Vendor Inventory View 6)
  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  // Vendor store status toggle (Online / Offline)
  const toggleStoreStatus = (storeId) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, isOpen: !s.isOpen } : s))
    );
  };

  // Admin vendor approvals
  const handleVendorApproval = (vendorId, action) => {
    setPendingVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: action } : v))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        subtotal,
        deliveryFee,
        handlingFee,
        grandTotal,
        stores,
        products,
        orders,
        pendingVendors,
        selectedStoreId,
        setSelectedStoreId,
        currentTrackingOrder,
        setCurrentTrackingOrder,
        savedAddresses,
        setSavedAddresses,
        selectedAddress,
        setSelectedAddress,
        customerLocation,
        setCustomerLocation,
        placeOrder,
        updateOrderStatus,
        updateProduct,
        toggleStoreStatus,
        handleVendorApproval,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

