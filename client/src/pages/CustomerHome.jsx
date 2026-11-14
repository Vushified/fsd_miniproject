import React, { useState, useMemo } from 'react';
import { Search, Star, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useDebounce } from '../hooks/useDebounce';

// View 1: Customer Home Page
// Allows customers to view available grocery stores near their location
export function CustomerHome({ onSelectStore }) {
  const { stores, customerLocation } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Debounced search to prevent heavy filtering on every keystroke (Section 2 Custom Hook)
  const debouncedSearch = useDebounce(searchTerm, 250);

  const categories = ['All', 'Groceries', 'Dairy', 'Snacks'];

  // Filter stores based on category and debounced search term
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesCategory =
        selectedCategory === 'All' || store.category === selectedCategory;
      const matchesSearch =
        store.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        store.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [stores, selectedCategory, debouncedSearch]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Banner with Search */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white dark:bg-neutral-950 p-6 sm:p-10 border border-neutral-800 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-medium text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-neutral-100" />
            Instant grocery delivery in 10 minutes
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Fresh groceries at your doorstep.
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Delivering right now to <span className="text-white font-semibold underline decoration-neutral-600 underline-offset-4">{customerLocation}</span>
          </p>

          {/* Search Bar with Icon & Validation */}
          <div className="relative pt-2">
            <Search className="absolute left-4 top-5 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stores or essentials (e.g. Milk, Chips, Dal)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white rounded-2xl text-sm font-medium border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Filters (Dairy, Snacks, Groceries) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
            Categories
          </h2>
          <span className="text-xs text-neutral-500">
            Showing {filteredStores.length} stores
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Available Stores Grid (Cards showing store name, distance, rating) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
          Stores Near You
        </h2>

        {filteredStores.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 text-sm">No stores matched your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-semibold text-neutral-900 dark:text-white underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => onSelectStore(store.id)}
                className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Store Image */}
                <div className="relative h-44 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-bold text-neutral-900 dark:text-white flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3" />
                    {store.deliveryTime}
                  </div>
                  {!store.isOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Currently Closed
                      </span>
                    </div>
                  )}
                </div>

                {/* Store Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-black transition">
                      {store.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      {store.rating}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {store.distance} • {store.category}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform">
                      Browse <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

