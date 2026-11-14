import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerHome } from './pages/CustomerHome';
import { StoreCatalog } from './pages/StoreCatalog';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTracking } from './pages/OrderTracking';
import { VendorOrders } from './pages/VendorOrders';
import { VendorInventory } from './pages/VendorInventory';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function AppContent() {
  const { role, user, isAuthenticated } = useAuth();
  const { setSelectedStoreId, setCurrentTrackingOrder } = useCart();

  // Active view state: dynamically defaults based on user role
  const [activeView, setActiveView] = useState(() => {
    const currentRole = role || 'customer';
    if (currentRole === 'vendor') return 'vendor-orders';
    if (currentRole === 'driver') return 'driver-dashboard';
    if (currentRole === 'admin') return 'admin-dashboard';
    return 'customer-home';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // When role changes (e.g. user signs into a different account), navigate to their role dashboard
  useEffect(() => {
    if (role === 'admin') {
      setActiveView('admin-dashboard');
    } else if (role === 'vendor') {
      setActiveView('vendor-orders');
    } else if (role === 'driver') {
      setActiveView('driver-dashboard');
    } else {
      // Customer
      setActiveView('customer-home');
    }
  }, [role]);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectStore = (storeId) => {
    setSelectedStoreId(storeId);
    setActiveView('store-catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order) => {
    setCurrentTrackingOrder(order);
    notify(`Order #${order.id} placed successfully!`, 'success');
    setActiveView('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userRole) => {
    notify(`Authenticated as ${userRole}`, 'success');
    if (userRole === 'admin') setActiveView('admin-dashboard');
    else if (userRole === 'vendor') setActiveView('vendor-orders');
    else if (userRole === 'driver') setActiveView('driver-dashboard');
    else setActiveView('customer-home');
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
        
        {/* Full-Screen Login / Register Page (shown when activeView === 'auth') */}
        {activeView === 'auth' && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}

        {/* =========================================
            1. CUSTOMER DASHBOARD & VIEWS (Role: Customer)
            ========================================= */}
        {activeView === 'customer-home' && (
          <CustomerHome onSelectStore={handleSelectStore} />
        )}

        {activeView === 'store-catalog' && (
          <StoreCatalog
            onBack={() => setActiveView('customer-home')}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutPage
            onBack={() => setActiveView('store-catalog')}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {activeView === 'order-tracking' && (
          <OrderTracking
            onBackToHome={() => setActiveView('customer-home')}
          />
        )}

        {/* =========================================
            2. VENDOR DASHBOARD & VIEWS (Role: Vendor)
            ========================================= */}
        {activeView === 'vendor-orders' && (
          role === 'vendor' || role === 'admin' ? (
            <VendorOrders
              onNavigateToInventory={() => setActiveView('vendor-inventory')}
            />
          ) : (
            <AccessDenied onBack={() => setActiveView('customer-home')} requiredRole="Store Vendor" />
          )
        )}

        {activeView === 'vendor-inventory' && (
          role === 'vendor' || role === 'admin' ? (
            <VendorInventory
              onBackToOrders={() => setActiveView('vendor-orders')}
            />
          ) : (
            <AccessDenied onBack={() => setActiveView('customer-home')} requiredRole="Store Vendor" />
          )
        )}

        {/* =========================================
            3. DELIVERY PARTNER DASHBOARD (Role: Driver)
            ========================================= */}
        {activeView === 'driver-dashboard' && (
          role === 'driver' || role === 'admin' ? (
            <DriverDashboard />
          ) : (
            <AccessDenied onBack={() => setActiveView('customer-home')} requiredRole="Delivery Partner" />
          )
        )}

        {/* =========================================
            4. ADMIN DASHBOARD (Role: Admin)
            ========================================= */}
        {activeView === 'admin-dashboard' && (
          role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <AccessDenied onBack={() => setActiveView('customer-home')} requiredRole="System Admin" />
          )
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

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 py-5 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 QuickDrop Technologies Inc. All rights reserved.</p>
          <p className="text-[11px] text-neutral-400">
            Secure 256-bit SSL • Real-time WebSockets • Role-Based Access Control
          </p>
        </div>
      </footer>
    </div>
  );
}

// Access Denied (403 Forbidden) Component for Unauthorized Roles
function AccessDenied({ onBack, requiredRole }) {
  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-4 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
        403 - Access Forbidden
      </h2>
      <p className="text-xs text-neutral-500 leading-relaxed">
        Your current account role does not have authorization to access the <strong>{requiredRole}</strong> portal.
      </p>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 mx-auto"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to My Dashboard
      </button>
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
