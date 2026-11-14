import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Power, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  IndianRupee,
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// View 7: Delivery Partner Dashboard
// Helps delivery drivers accept nearby orders and update delivery steps
export function DriverDashboard() {
  const { orders, updateOrderStatus } = useCart();
  const [isOnline, setIsOnline] = useState(true);
  const [activeDriverTab, setActiveDriverTab] = useState('active'); // 'active' | 'history'

  // Orders that are ready for pickup or on the way
  const availableDeliveries = orders.filter(
    (o) => o.status === 'Packing' || o.status === 'Out for Delivery'
  );

  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  // Accept incoming delivery request
  const handleAcceptOrder = (orderId) => {
    updateOrderStatus(orderId, 'Out for Delivery', {
      driverName: 'Ramesh Sharma',
      driverPhone: '+91 91234 56789',
    });
  };

  // Mark delivered
  const handleMarkDelivered = (orderId) => {
    updateOrderStatus(orderId, 'Delivered');
  };

  // Driver metrics
  const totalDeliveriesToday = deliveredOrders.length + 3; // + mock completed
  const totalEarningsToday = totalDeliveriesToday * 45; // ₹45 per delivery

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Delivery Partner Hub
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Ramesh Sharma • Vehicle: Honda Activa (MH-02-CD-5432)
          </p>
        </div>

        {/* Duty Status Toggle (Assignment Requirement: Online/Offline) */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
            isOnline
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-neutral-800 text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          Duty: {isOnline ? 'ONLINE (Accepting Orders)' : 'OFFLINE (On Break)'}
        </button>
      </div>

      {/* Driver Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-neutral-400">
            Today's Earnings
          </p>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-1">
            ₹{totalEarningsToday}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            +₹45 per delivery
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-neutral-400">
            Completed Trips
          </p>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-1">
            {totalDeliveriesToday}
          </p>
          <span className="text-[10px] text-neutral-400">Target: 10 trips</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-neutral-400">
            Avg Delivery Time
          </p>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-1">
            11.4 mins
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            Lightning Fast
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-neutral-400">
            Partner Rating
          </p>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-1">
            4.9 ★
          </p>
          <span className="text-[10px] text-neutral-400">Top Rated Partner</span>
        </div>
      </div>

      {/* Duty Offline Banner */}
      {!isOnline && (
        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-neutral-500" />
          <span>
            You are currently offline. Turn your duty status <strong>Online</strong> to receive nearby delivery requests.
          </span>
        </div>
      )}

      {/* Incoming Delivery Request Pop-up Cards (Assignment Requirement) */}
      {isOnline && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Active Delivery Assignments ({availableDeliveries.length})
            </h2>
            <span className="text-xs text-neutral-500">
              Live GPS Sync Active
            </span>
          </div>

          {availableDeliveries.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
              <Clock className="w-8 h-8 text-neutral-400 mx-auto" />
              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Searching for orders near you...
              </p>
              <p className="text-[11px] text-neutral-400">
                Stay close to popular stores in Bandra West to receive instant requests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDeliveries.map((order) => {
                const isOutForDelivery = order.status === 'Out for Delivery';

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      
                      {/* Header with status */}
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Order #{order.id}
                          </span>
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                            {order.customerName}
                          </h3>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isOutForDelivery
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Store Pickup location */}
                      <div className="flex items-start gap-2.5 text-xs">
                        <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                          1
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-white block">
                            Pickup Store:
                          </span>
                          <p className="text-neutral-500">
                            {order.storeName} (Bandra West)
                          </p>
                        </div>
                      </div>

                      {/* Drop-off Customer location */}
                      <div className="flex items-start gap-2.5 text-xs">
                        <div className="w-6 h-6 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                          2
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-white block">
                            Customer Drop-off:
                          </span>
                          <p className="text-neutral-500 leading-relaxed">
                            {order.deliveryAddress}
                          </p>
                        </div>
                      </div>

                      {/* Item count & Payment */}
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-[11px] text-neutral-500">
                        <span>{order.items.length} items to deliver</span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          Pay Mode: {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2">
                      {!isOutForDelivery ? (
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="w-full py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Accept & Navigate Route
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="p-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl transition flex items-center justify-center hover:bg-neutral-200"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleMarkDelivered(order.id)}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Order Delivered
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

