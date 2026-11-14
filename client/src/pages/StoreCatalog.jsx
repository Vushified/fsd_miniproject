import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingBag, Star, Clock, MapPin, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

// View 2: Store Catalog & Cart Page
// Displays products available in the selected store and lets users build a cart
export function StoreCatalog({ onBack, onProceedToCheckout }) {
  const {
    stores,
    products,
    selectedStoreId,
    cart,
    addToCart,
    updateQuantity,
    cartItemCount,
    subtotal,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState('All');

  // Find currently selected store
  const currentStore =
    stores.find((s) => s.id === selectedStoreId) || stores[0];

  // Filter products for this specific store
  // (In real quick commerce, products belong to a store or warehouse)
  const storeProducts = products.filter(
    (p) => p.storeId === currentStore.id || p.storeId === 'store-1' || p.storeId === 'store-2' || p.storeId === 'store-3'
  );

  const categories = ['All', 'Dairy', 'Snacks', 'Groceries'];

  const filteredProducts =
    activeCategory === 'All'
      ? storeProducts
      : storeProducts.filter((p) => p.category === activeCategory);

  // Helper to get product count currently in cart
  const getCartQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6 pb-28 animate-fade-in">
      
      {/* Back button & Store Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all stores
        </button>

        {/* Store Details Header Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {currentStore.name}
                </h1>
                <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded font-semibold">
                  {currentStore.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentStore.address}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {currentStore.deliveryTime}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <Star className="w-4 h-4 fill-current text-amber-500" />
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {currentStore.rating}
              </span>
              <span className="text-xs text-neutral-400">(2.4k+ reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const qty = getCartQuantity(product.id);

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden p-3.5 flex flex-col justify-between hover:shadow-md transition duration-200"
            >
              {/* Product Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-white/90 dark:bg-neutral-900/90 text-[10px] font-bold px-1.5 py-0.5 rounded text-neutral-700 dark:text-neutral-300">
                  {product.unit}
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {product.description}
                  </p>
                </div>

                {/* Price & Add to Cart button */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div>
                    <span className="text-sm font-black text-neutral-900 dark:text-white">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[11px] text-neutral-400 line-through ml-1.5">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-2 py-0.5 rounded-lg text-xs font-bold shadow-sm">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="hover:opacity-75 p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span>{qty}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="hover:opacity-75 p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Cart Summary Bar (assignment View 2 component) */}
      {cartItemCount > 0 && (
        <aside className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-30 animate-slide-up">
          <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-neutral-800 dark:border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 dark:text-neutral-600 font-medium">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-base font-black">
                  ₹{subtotal}
                  <span className="text-xs font-normal text-neutral-400 dark:text-neutral-600 ml-1.5">
                    (Plus taxes/charges)
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="px-5 py-2.5 bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white rounded-xl text-xs font-bold hover:opacity-90 transition active:scale-95 shadow-md flex items-center gap-1.5"
            >
              Proceed to Checkout
              <span>&rarr;</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

