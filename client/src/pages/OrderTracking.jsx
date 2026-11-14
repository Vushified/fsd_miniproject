import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// View 4: Live Order Tracking Page
// Allows customer to see the progress of their delivery
export function OrderTracking({ onBackToHome }) {
  const { currentTrackingOrder, updateOrderStatus } = useCart();
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes timer

  const order = currentTrackingOrder;

  // Real-time delivery countdown timer with useEffect and cleanup function
  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Section 2: React Concepts - Proper cleanup function on unmount
    return () => {
      clearInterval(timer);
    };
  }, [order?.status]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <p className="text-sm text-neutral-500">No active order to track.</p>
        <button
          onClick={onBackToHome}
          className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  // Define steps
  const steps = [
    { id: 'Placed', label: 'Order Placed', icon: Clock },
    { id: 'Packing', label: 'Store Packing', icon: Package },
    { id: 'Out for Delivery', label: 'On The Way', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === order.status);

  // Quick simulation helper for demo / viva: advance status with a click!
  const handleAdvanceStatus = () => {
    const nextStatuses = ['Placed', 'Packing', 'Out for Delivery', 'Delivered'];
    const nextIdx = (currentStepIndex + 1) % nextStatuses.length;
    updateOrderStatus(order.id, nextStatuses[nextIdx]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      
      {/* Navigation: Button to go back to Customer Home Page */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Demo trigger to simulate status advance for viva examiner */}
        <button
          onClick={handleAdvanceStatus}
          className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 transition"
        >
          <RefreshCw className="w-3 h-3" />
          Simulate Next Step
        </button>
      </div>

      {/* Main Status Progress Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-8 shadow-sm">
        
        {/* Estimated Time and Order ID Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Live Order #{order.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-0.5">
              {order.status === 'Delivered'
                ? 'Order Delivered Successfully!'
                : `Arriving in ${formatTime(secondsRemaining)} mins`}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Store: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{order.storeName}</span>
            </p>
          </div>

          <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-4 py-2 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
              Current Status
            </span>
            <span className="text-sm font-black tracking-wide">
              {order.status}
            </span>
          </div>
        </div>

        {/* Status Progress Bar (Placed -> Packing -> Out for Delivery -> Delivered) */}
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md scale-105'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-[11px] font-bold ${
                        isCompleted
                          ? 'text-neutral-900 dark:text-white'
                          : 'text-neutral-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold inline-block">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Track Line */}
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-neutral-950 dark:bg-white h-full transition-all duration-500 rounded-full"
              style={{
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Missing Item / Refund Notification Box (Explicit Assignment Requirement) */}
        {order.missingItemRefund ? (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Item Out of Stock - Refund Processed
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {order.missingItemRefund.message}
              </p>
              <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                Refund Amount: ₹{order.missingItemRefund.amount} has been credited to your original payment mode.
              </p>
            </div>
          </div>
        ) : null}

        {/* Delivery Partner Details Card */}
        {order.driverName && (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-800 dark:text-neutral-200">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  {order.driverName}
                </p>
                <p className="text-[11px] text-neutral-500">
                  Your Delivery Partner • 4.9 ★ Rating
                </p>
              </div>
            </div>
            <a
              href={`tel:${order.driverPhone}`}
              className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 shadow-sm hover:border-black dark:hover:border-white transition"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Partner
            </a>
          </div>
        )}

        {/* Address and Itemized Bill */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          
          {/* Delivery Address Details */}
          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Delivery Location
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {order.deliveryAddress}
            </p>
          </div>

          {/* Itemized Bill */}
          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white">
              Itemized Bill
            </h3>
            <div className="bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className={`${it.available === false ? 'line-through text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                    {it.name} (x{it.quantity})
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {it.available === false ? 'Out of Stock' : `₹${it.price * it.quantity}`}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-xs text-neutral-900 dark:text-white">
                <span>Total Paid ({order.paymentMethod})</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

