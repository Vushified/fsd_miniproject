import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  Store, 
  Truck, 
  ShieldCheck, 
  Boxes, 
  Package, 
  LogIn 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export function Navbar({ activeView, setActiveView, onOpenCart, onOpenAuthModal }) {
  const { cartItemCount, customerLocation, setCustomerLocation } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const { user, role, isAuthenticated, logout } = useAuth();
  
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const availableLocations = [
    'Bandra West, Mumbai',
    'Khar West, Mumbai',
    'Santacruz West, Mumbai',
    'Juhu Scheme, Mumbai',
    'Andheri East, Mumbai',
  ];

  // Role badges with distinct minimalist styles
  const roleBadges = {
    customer: { label: 'Customer', icon: User, color: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' },
    vendor: { label: 'Store Vendor', icon: Store, color: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300' },
    driver: { label: 'Delivery Partner', icon: Truck, color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' },
    admin: { label: 'System Admin', icon: ShieldCheck, color: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300' },
  };

  const currentBadge = role ? roleBadges[role] : null;
  const RoleIcon = currentBadge?.icon || User;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & 10-Min Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (role === 'vendor') setActiveView('vendor-orders');
                else if (role === 'driver') setActiveView('driver-dashboard');
                else if (role === 'admin') setActiveView('admin-dashboard');
                else setActiveView('customer-home');
              }}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-9 h-9 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
                Q
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
                  QuickDrop
                  <span className="text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                    10 MIN
                  </span>
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                  Groceries & Essentials
                </p>
              </div>
            </button>

            {/* Location Selector (Public storefront or customer) */}
            {(!role || role === 'customer') && (
              <div className="relative hidden md:block ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => setLocationModalOpen(!locationModalOpen)}
                  className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
                  <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[130px]">
                    {customerLocation}
                  </span>
                  <span className="text-neutral-400 text-[10px]">▼</span>
                </button>

                {locationModalOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-50">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2 py-1">
                      Select Your Area
                    </p>
                    {availableLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setCustomerLocation(loc);
                          setLocationModalOpen(false);
                        }}
                        className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition ${
                          customerLocation === loc
                            ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-white'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Navigation Links: Dynamic based on authorization */}
          <nav className="hidden sm:flex items-center gap-2">
            {role === 'vendor' && (
              <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setActiveView('vendor-orders')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeView === 'vendor-orders'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveView('vendor-inventory')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeView === 'vendor-inventory'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  Inventory
                </button>
              </div>
            )}

            {(!role || role === 'customer') && (
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('customer-home')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeView === 'customer-home'
                      ? 'text-neutral-950 dark:text-white underline underline-offset-4'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Browse Stores
                </button>
                <button
                  onClick={() => setActiveView('order-tracking')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeView === 'order-tracking'
                      ? 'text-neutral-950 dark:text-white underline underline-offset-4'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Track Order
                </button>
              </div>
            )}
          </nav>

          {/* Right: Cart, Theme Toggle, Profile or Sign In Button */}
          <div className="flex items-center gap-2.5">
            
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Button (for storefront) */}
            {(!role || role === 'customer') && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-semibold hover:opacity-90 transition active:scale-95 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* If Logged In: Show User Profile & Logout Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold ${currentBadge?.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{user?.name}</span>
                  <span className="text-[10px] uppercase font-bold opacity-75">
                    ({currentBadge?.label})
                  </span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setActiveView('customer-home');
                  }}
                  title="Sign Out"
                  className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* If Not Logged In: Real-World "Sign In" Button in Navbar! */
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:opacity-90 transition shadow-sm active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
