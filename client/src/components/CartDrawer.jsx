import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Slide-over cart drawer for quick review
export function CartDrawer({ isOpen, onClose, onProceedToCheckout }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    handlingFee,
    grandTotal,
    cartItemCount,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900 dark:text-white" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                My Cart ({cartItemCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100 dark:divide-neutral-800">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Your cart is empty.
                </p>
                <p className="text-[11px] text-neutral-400">
                  Browse your favourite store and add items to order.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      ₹{item.price} • {item.unit}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg text-xs font-bold border border-neutral-200 dark:border-neutral-700">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-neutral-900 dark:text-white min-w-[12px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-3">
              <div className="space-y-1 text-xs text-neutral-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Fee</span>
                  <span>₹{handlingFee}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-black text-sm text-neutral-900 dark:text-white">
                  <span>Total Bill</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:opacity-90 transition active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

