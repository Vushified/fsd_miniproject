import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Sun, 
  Moon, 
  User, 
  Store, 
  Truck, 
  ShieldCheck, 
  Boxes, 
  Package, 
  LogIn,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export function Navbar({ activeView, setActiveView, onOpenCart }) {
  const { cartItemCount, customerLocation, setCustomerLocation } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const { user, role, switchRole } = useAuth();
  
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const availableLocations = [
    'Bandra West, Mumbai',
    'Khar West, Mumbai',
    'Santacruz West, Mumbai',
    'Juhu Scheme, Mumbai',
    'Andheri East, Mumbai',
  ];

  // Distinct roles for authorization
  const rolesList = [
    { id: 'customer', label: 'Customer', name: 'Vidushi Singh', icon: User, desc: 'Shop groceries & track delivery' },
    { id: 'vendor', label: 'Store Vendor', name: 'FreshBasket Vendor', icon: Store, desc: 'Pack orders & manage inventory' },
    { id: 'driver', label: 'Delivery Partner', name: 'Ramesh Sharma', icon: Truck, desc: 'Accept orders & navigate routes' },
    { id: 'admin', label: 'System Admin', name: 'System Admin', icon: ShieldCheck, desc: 'Platform oversight & approvals' },
  ];

  const currentRoleInfo = rolesList.find((r) => r.id === role) || rolesList[0];
  const CurrentIcon = currentRoleInfo.icon;

  const handleRoleSelect = (newRole) => {
    switchRole(newRole);
    setRoleMenuOpen(false);
  };

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

            {/* Location Selector (Only for customer) */}
            {role === 'customer' && (
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

          {/* Center Links: Contextual to the logged in role */}
          <nav className="hidden sm:flex items-center gap-2">
            {role === 'customer' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('customer-home')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeView === 'customer-home'
                      ? 'text-neutral-950 dark:text-white underline underline-offset-4'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Stores & Groceries
                </button>
                <button
                  onClick={() => setActiveView('order-tracking')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeView === 'order-tracking'
                      ? 'text-neutral-950 dark:text-white underline underline-offset-4'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Live Tracking
                </button>
              </div>
            )}

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
                  Orders Checklist
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
          </nav>

          {/* Right: Role Switcher / Cart / Theme */}
          <div className="flex items-center gap-2">
            
            {/* Dark / Light Mode */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Button (For customer) */}
            {role === 'customer' && (
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

            {/* Account & Role Switcher Dropdown (Supports Two-Window demo & Viva evaluation) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-900 dark:text-white hover:border-black dark:hover:border-white transition shadow-sm"
              >
                <CurrentIcon className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
                <span className="hidden sm:inline">{user?.name || currentRoleInfo.name}</span>
                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300 font-semibold uppercase">
                  {currentRoleInfo.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Role Dropdown */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5">
                    Switch Authorized Role
                  </p>

                  {rolesList.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold leading-tight">{r.label}</p>
                          <p className="text-[10px] opacity-75">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}

                  <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        setActiveView('auth');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-2 rounded-lg"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In with Password / Register
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
