import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Power, 
  Save, 
  Boxes, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useDebounce } from '../hooks/useDebounce';

// View 6: Vendor Inventory Page
// Allows store owners to manage product stock and turn store online/offline
export function VendorInventory({ onBackToOrders }) {
  const { stores, products, updateProduct, toggleStoreStatus } = useCart();
  
  // Currently managed vendor store (default store-1)
  const myStore = stores[0];

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 200);

  // Local draft state for quick inline edits
  const [editingValues, setEditingValues] = useState({});
  const [savedSuccessId, setSavedSuccessId] = useState(null);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [products, debouncedSearch]);

  // Handle local change in inputs
  const handleInputChange = (productId, field, value) => {
    setEditingValues((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  // Save changes to global state
  const handleSaveProduct = (productId) => {
    const edits = editingValues[productId];
    if (!edits) return;

    updateProduct(productId, {
      ...(edits.price !== undefined ? { price: Number(edits.price) } : {}),
      ...(edits.stock !== undefined ? { stock: Number(edits.stock) } : {}),
    });

    setSavedSuccessId(productId);
    setTimeout(() => setSavedSuccessId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToOrders}
          className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Store Inventory & Stock
          </h1>
          <p className="text-xs text-neutral-500">
            {myStore.name} • {products.length} Products Cataloged
          </p>
        </div>
      </div>

      {/* Store Status Card (Online / Offline Toggle) */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              myStore.isOpen
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300'
            }`}
          >
            <Power className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Store Duty Status
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  myStore.isOpen
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {myStore.isOpen ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {myStore.isOpen
                ? 'Your store is currently visible to nearby customers and receiving orders.'
                : 'Your store is marked closed. No incoming customer orders will be accepted.'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => toggleStoreStatus(myStore.id)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${
            myStore.isOpen
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          {myStore.isOpen ? 'Turn Store Offline' : 'Turn Store Online'}
        </button>
      </div>

      {/* Product Search & Inventory Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-4 h-4" />
            Product Stock Management
          </h3>

          {/* Search bar with useDebounce */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Stock Qty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              {filteredProducts.map((p) => {
                const currentEdits = editingValues[p.id] || {};
                const displayPrice =
                  currentEdits.price !== undefined ? currentEdits.price : p.price;
                const displayStock =
                  currentEdits.stock !== undefined ? currentEdits.stock : p.stock;
                const isModified =
                  currentEdits.price !== undefined || currentEdits.stock !== undefined;

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition">
                    
                    {/* Product Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white line-clamp-1">
                            {p.name}
                          </p>
                          <span className="text-[10px] text-neutral-400">{p.unit}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                        {p.category}
                      </span>
                    </td>

                    {/* Price Input Field (Assignment Requirement) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={displayPrice}
                          onChange={(e) => handleInputChange(p.id, 'price', e.target.value)}
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </td>

                    {/* Stock Quantity Input Field (Assignment Requirement) */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={displayStock}
                        onChange={(e) => handleInputChange(p.id, 'stock', e.target.value)}
                        className="w-16 px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </td>

                    {/* In Stock / Out of Stock toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          updateProduct(p.id, { inStock: !p.inStock })
                        }
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>

                    {/* Save Action */}
                    <td className="py-3 px-4 text-right">
                      {savedSuccessId === p.id ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Saved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSaveProduct(p.id)}
                          disabled={!isModified}
                          className="px-3 py-1 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-lg text-xs font-bold transition disabled:opacity-20 flex items-center gap-1 ml-auto shadow-sm"
                        >
                          <Save className="w-3 h-3" />
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

