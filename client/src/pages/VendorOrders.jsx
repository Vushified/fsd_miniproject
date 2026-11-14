import React, { useState } from 'react';
import { 
  Package, 
  CheckSquare, 
  Square, 
  AlertOctagon, 
  Truck, 
  Clock, 
  Phone, 
  CheckCircle2,
  Boxes 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// View 5: Vendor Order Page
// Enables store owners to view and pack incoming customer orders
export function VendorOrders({ onNavigateToInventory }) {
  const { orders, updateOrderStatus } = useCart();
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id);

  // Track checked items for packing per order
  const [packedItemsMap, setPackedItemsMap] = useState({});

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Toggle item packed status in checklist
  const toggleItemPacked = (orderId, itemId) => {
    setPackedItemsMap((prev) => {
      const currentOrderItems = prev[orderId] || {};
      return {
        ...prev,
        [orderId]: {
          ...currentOrderItems,
          [itemId]: !currentOrderItems[itemId],
        },
      };
    });
  };

  // Mark item out of stock (Assignment requirement: handles missing item & refund)
  const handleMarkOutOfStock = (orderId, itemId, itemName, itemPrice) => {
    const updatedItems = activeOrder.items.map((it) =>
      it.id === itemId ? { ...it, available: false } : it
    );
    const refundAmount = itemPrice;
    const newTotal = Math.max(0, activeOrder.totalAmount - refundAmount);

    updateOrderStatus(orderId, activeOrder.status, {
      items: updatedItems,
      totalAmount: newTotal,
      missingItemRefund: {
        amount: refundAmount,
        message: `${itemName} was out of stock at the store. Refund of ₹${refundAmount} has been credited.`,
      },
    });
  };

  // Mark Ready for Pickup (moves status to Out for Delivery / Ready for driver)
  const handleMarkReadyForPickup = (orderId) => {
    updateOrderStatus(orderId, 'Out for Delivery', {
      driverName: 'Ramesh Sharma',
      driverPhone: '+91 91234 56789',
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
      {/* Top Header with Switch to Inventory */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Vendor Order Management
            </h1>
            <span className="text-[11px] font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-2.5 py-0.5 rounded-full">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Review incoming items, check off packaged goods, and hand off to drivers.
          </p>
        </div>

        <button
          onClick={onNavigateToInventory}
          className="px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Boxes className="w-4 h-4" />
          Manage Store Inventory &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Incoming Order List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Incoming Orders
          </h2>
          <div className="space-y-2">
            {orders.map((ord) => {
              const isSelected = ord.id === activeOrder?.id;
              const statusColor =
                ord.status === 'Placed'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : ord.status === 'Packing'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`cursor-pointer p-4 rounded-2xl border text-xs transition space-y-2 ${
                    isSelected
                      ? 'border-neutral-950 dark:border-white bg-white dark:bg-neutral-900 shadow-md ring-1 ring-neutral-950 dark:ring-white'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      #{ord.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-neutral-500 font-medium">
                    {ord.customerName} • {ord.items.length} items
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    <span>{ord.createdAt}</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      ₹{ord.totalAmount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Packing Details & Item Checklist (2 cols) */}
        {activeOrder && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6 shadow-sm">
              
              {/* Active Order Summary Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                    Packing Order #{activeOrder.id}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Customer: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{activeOrder.customerName}</span> ({activeOrder.customerPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeOrder.status === 'Placed' && (
                    <button
                      onClick={() => updateOrderStatus(activeOrder.id, 'Packing')}
                      className="px-3.5 py-1.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Accept & Start Packing
                    </button>
                  )}
                  {activeOrder.status === 'Packing' && (
                    <button
                      onClick={() => handleMarkReadyForPickup(activeOrder.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Truck className="w-4 h-4" />
                      Mark Ready for Pickup
                    </button>
                  )}
                  {activeOrder.status === 'Out for Delivery' && (
                    <span className="text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Handed to Driver ({activeOrder.driverName || 'Ramesh'})
                    </span>
                  )}
                </div>
              </div>

              {/* Item Checklist (Assignment requirement) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Item Checklist ({activeOrder.items.length} items to pack)
                  </h4>
                  <span className="text-[11px] text-neutral-500">
                    Tick items as you place them in the bag
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                  {activeOrder.items.map((it) => {
                    const isPacked =
                      packedItemsMap[activeOrder.id]?.[it.id] || false;
                    const isOutOfStock = it.available === false;

                    return (
                      <div
                        key={it.id}
                        className={`p-3.5 flex items-center justify-between gap-3 text-xs transition ${
                          isOutOfStock
                            ? 'bg-red-50/50 dark:bg-red-950/20'
                            : isPacked
                            ? 'bg-neutral-50/80 dark:bg-neutral-800/40'
                            : 'bg-white dark:bg-neutral-900'
                        }`}
                      >
                        {/* Checkbox & Item Name */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => toggleItemPacked(activeOrder.id, it.id)}
                            className="p-0.5 text-neutral-900 dark:text-white disabled:opacity-30"
                          >
                            {isPacked ? (
                              <CheckSquare className="w-5 h-5 text-neutral-950 dark:text-white" />
                            ) : (
                              <Square className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                            )}
                          </button>
                          <div>
                            <p
                              className={`font-semibold ${
                                isOutOfStock
                                  ? 'line-through text-red-500'
                                  : isPacked
                                  ? 'line-through text-neutral-400 dark:text-neutral-500'
                                  : 'text-neutral-900 dark:text-white'
                              }`}
                            >
                              {it.name}
                            </p>
                            <p className="text-[11px] text-neutral-400">
                              Quantity: <span className="font-bold text-neutral-700 dark:text-neutral-300">{it.quantity}</span> • Unit Price: ₹{it.price}
                            </p>
                          </div>
                        </div>

                        {/* Actions: Out of stock button */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 dark:text-white">
                            ₹{it.price * it.quantity}
                          </span>
                          {!isOutOfStock ? (
                            <button
                              onClick={() =>
                                handleMarkOutOfStock(
                                  activeOrder.id,
                                  it.id,
                                  it.name,
                                  it.price * it.quantity
                                )
                              }
                              className="px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200 dark:border-red-900/60 transition"
                            >
                              Out of Stock
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded">
                              Refunded
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">
                    Drop-off Address:
                  </span>
                  {activeOrder.deliveryAddress}
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-900 dark:text-white block">
                    Payment:
                  </span>
                  {activeOrder.paymentMethod} ({activeOrder.paymentStatus})
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

