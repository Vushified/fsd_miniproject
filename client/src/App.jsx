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
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function AppContent() {
  const { role, user, isAuthenticated, logout } = useAuth();
  const { setSelectedStoreId, setCurrentTrackingOrder } = useCart();

  // Active view: Defaults to customer landing page
  const [activeView, setActiveView] = useState(() => {
    if (role === 'admin') return 'admin-dashboard';
    if (role === 'vendor') return 'vendor-orders';
    if (role === 'driver') return 'driver-dashboard';
    return 'customer-home';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync view when role changes on login or logout
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') setActiveView('admin-dashboard');
      else if (role === 'vendor') setActiveView('vendor-orders');
      else if (role === 'driver') setActiveView('driver-dashboard');
      else setActiveView('customer-home');
    } else {
      setActiveView('customer-home');
    }
  }, [role, isAuthenticated]);

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
    if (!isAuthenticated) {
      notify('Please sign in to proceed with checkout', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order) => {
    setCurrentTrackingOrder(order);
    notify(`Order #${order.id} placed successfully!`, 'success');
    setActiveView('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when JWT login succeeds in AuthModal
  const handleLoginSuccess = (userRole) => {
    notify(`Welcome back! Signed in as ${userRole}`, 'success');
    if (userRole === 'admin') setActiveView('admin-dashboard');
    else if (userRole === 'vendor') setActiveView('vendor-orders');
    else if (userRole === 'driver') setActiveView('driver-dashboard');
    else setActiveView('customer-home');
  };

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Real-World Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* =========================================
            1. PUBLIC STOREFRONT / CUSTOMER VIEWS
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
          isAuthenticated ? (
            <CheckoutPage
              onBack={() => setActiveView('store-catalog')}
              onOrderPlaced={handleOrderPlaced}
            />
          ) : (
            <div className="text-center py-20 space-y-4">
              <p className="text-sm text-neutral-500">Please sign in to complete your checkout.</p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-md"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {activeView === 'order-tracking' && (
          <OrderTracking
            onBackToHome={() => setActiveView('customer-home')}
          />
        )}

        {/* =========================================
            2. VENDOR DASHBOARD (Protected: Role 'vendor' or 'admin')
            ========================================= */}
        {activeView === 'vendor-orders' && (
          role === 'vendor' || role === 'admin' ? (
            <VendorOrders
              onNavigateToInventory={() => setActiveView('vendor-inventory')}
            />
          ) : (
            <AccessDenied 
              onBack={() => setActiveView('customer-home')} 
              onOpenAuth={() => setIsAuthModalOpen(true)}
              requiredRole="Store Vendor" 
            />
          )
        )}

        {activeView === 'vendor-inventory' && (
          role === 'vendor' || role === 'admin' ? (
            <VendorInventory
              onBackToOrders={() => setActiveView('vendor-orders')}
            />
          ) : (
            <AccessDenied 
              onBack={() => setActiveView('customer-home')} 
              onOpenAuth={() => setIsAuthModalOpen(true)}
              requiredRole="Store Vendor" 
            />
          )
        )}

        {/* =========================================
            3. DELIVERY PARTNER DASHBOARD (Protected: Role 'driver' or 'admin')
            ========================================= */}
        {activeView === 'driver-dashboard' && (
          role === 'driver' || role === 'admin' ? (
            <DriverDashboard />
          ) : (
            <AccessDenied 
              onBack={() => setActiveView('customer-home')} 
              onOpenAuth={() => setIsAuthModalOpen(true)}
              requiredRole="Delivery Partner" 
            />
          )
        )}

        {/* =========================================
            4. ADMIN DASHBOARD (Protected: Role 'admin' strictly)
            ========================================= */}
        {activeView === 'admin-dashboard' && (
          role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <AccessDenied 
              onBack={() => setActiveView('customer-home')} 
              onOpenAuth={() => setIsAuthModalOpen(true)}
              requiredRole="System Admin" 
            />
          )
        )}
      </main>

      {/* Role-Based JWT Auth Modal (Opened from Sign In button) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

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
    </div>
  );
}

// Access Denied Component for Protected Routes
function AccessDenied({ onBack, onOpenAuth, requiredRole }) {
  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-4 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
        403 - Access Forbidden
      </h2>
      <p className="text-xs text-neutral-500 leading-relaxed">
        You must be signed in as an authorized <strong>{requiredRole}</strong> to access this dashboard.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Browse Storefront
        </button>
        <button
          onClick={onOpenAuth}
          className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:opacity-90 transition shadow-sm"
        >
          Sign In as {requiredRole}
        </button>
      </div>
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
