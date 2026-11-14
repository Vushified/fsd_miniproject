import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerHome } from './pages/CustomerHome';
import { StoreCatalog } from './pages/StoreCatalog';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTracking } from './pages/OrderTracking';
import { VendorOrders } from './pages/VendorOrders';
import { VendorInventory } from './pages/VendorInventory';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { useCart } from './context/CartContext';

export function AppContent() {
  // Navigation view router state (covers all 8 views from assignment)
  // 'customer-home' | 'store-catalog' | 'checkout' | 'order-tracking' | 'vendor-orders' | 'vendor-inventory' | 'driver-dashboard' | 'admin-dashboard'
  const [activeView, setActiveView] = useState('customer-home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const { setSelectedStoreId, setCurrentTrackingOrder } = useCart();

  // Show quick toast notification
  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // View 1 -> View 2: User selects store
  const handleSelectStore = (storeId) => {
    setSelectedStoreId(storeId);
    setActiveView('store-catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View 2 -> View 3: Proceed to Checkout
  const handleProceedToCheckout = () => {
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View 3 -> View 4: Order placed successfully
  const handleOrderPlaced = (order) => {
    setCurrentTrackingOrder(order);
    notify(`Order #${order.id} placed successfully! Packing starting now.`, 'success');
    setActiveView('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* View 1: Customer Home Page */}
        {activeView === 'customer-home' && (
          <CustomerHome onSelectStore={handleSelectStore} />
        )}

        {/* View 2: Store Catalog & Cart Page */}
        {activeView === 'store-catalog' && (
          <StoreCatalog
            onBack={() => setActiveView('customer-home')}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {/* View 3: Checkout Page */}
        {activeView === 'checkout' && (
          <CheckoutPage
            onBack={() => setActiveView('store-catalog')}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {/* View 4: Live Order Tracking Page */}
        {activeView === 'order-tracking' && (
          <OrderTracking
            onBackToHome={() => setActiveView('customer-home')}
          />
        )}

        {/* View 5: Vendor Order Page */}
        {activeView === 'vendor-orders' && (
          <VendorOrders
            onNavigateToInventory={() => setActiveView('vendor-inventory')}
          />
        )}

        {/* View 6: Vendor Inventory Page */}
        {activeView === 'vendor-inventory' && (
          <VendorInventory
            onBackToOrders={() => setActiveView('vendor-orders')}
          />
        )}

        {/* View 7: Delivery Partner Dashboard */}
        {activeView === 'driver-dashboard' && (
          <DriverDashboard />
        )}

        {/* View 8: Admin Dashboard */}
        {activeView === 'admin-dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Toast Notification */}
      <Toast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Minimalist Clean Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 py-6 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            QuickDrop Quick-Commerce • Full-Stack Mini Project
          </p>
          <p>
            Minimalist White & Grey Theme • Built for Vidushi Singh (Roll No. 53, D15A)
          </p>
        </div>
      </footer>
    </div>
  );
}

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

