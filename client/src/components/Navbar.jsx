import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Store, 
  Truck, 
  ShieldCheck, 
  User,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export function Navbar({ activeView, setActiveView, onOpenCart }) {
  const { cartItemCount, customerLocation, setCustomerLocation } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const { user, role, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const availableLocations = [
    'Bandra West, Mumbai',
    'Khar West, Mumbai',
    'Santacruz West, Mumbai',
    'Juhu Scheme, Mumbai',
    'Andheri East, Mumbai',
  ];

  // Quick module switcher tabs
  const navTabs = [
    { id: 'customer-home', label: 'Customer', icon: Store, role: 'customer' },
    { id: 'vendor-orders', label: 'Vendor', icon: Store, role: 'vendor' },
    { id: 'driver-dashboard', label: 'Delivery', icon: Truck, role: 'driver' },
    { id: 'admin-dashboard', label: 'Admin', icon: ShieldCheck, role: 'admin' },
  ];

  const handleTabClick = (tab) => {
    switchRole(tab.role);
    setActiveView(tab.id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & 10-Min Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('customer-home')}
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

            {/* Location Selector (Customer requirement from assignment View 1) */}
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

              {/* Location Dropdown */}
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
          </div>

          {/* Center: Module Switcher (Viva & Checklist Friendly) */}
          <nav className="hidden lg:flex items-center bg-neutral-100 dark:bg-neutral-800/60 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView.startsWith(tab.role);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Cart, Theme Toggle, Role Badge, Mobile Hamburger */}
          <div className="flex items-center gap-2">
            
            {/* Active Role Indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-[11px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="capitalize">{role} Mode</span>
            </div>

            {/* Dark / Light Mode Toggle (Checklist Optional Item) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Button with Count Badge */}
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-5 space-y-3">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Switch Module View
          </p>
          <div className="grid grid-cols-2 gap-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left ${
                    activeView.startsWith(tab.role)
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-transparent'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label} View
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-[11px] text-neutral-400 mb-1.5">Delivery Location:</p>
            <div className="flex flex-wrap gap-1.5">
              {availableLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setCustomerLocation(loc);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                    customerLocation === loc
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

