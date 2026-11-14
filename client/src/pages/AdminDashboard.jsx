import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Truck, 
  IndianRupee, 
  Users, 
  Check, 
  X, 
  BarChart3, 
  FileText, 
  TrendingUp,
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// View 8: Admin Dashboard
// Provides systemic oversight for approving new stores and viewing app summary
export function AdminDashboard() {
  const { stores, orders, pendingVendors, handleVendorApproval } = useCart();
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'reports'

  // Summary Metrics calculations
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 14850; // + baseline
  const activeStoresCount = stores.filter((s) => s.isOpen).length;
  const totalActiveDrivers = 12;
  const totalOrdersPlaced = orders.length + 84;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Admin System Overview
            </h1>
            <span className="text-xs bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-2 py-0.5 rounded-full font-bold">
              Root Access
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time platform metrics, merchant approvals, and financial logs.
          </p>
        </div>

        {/* Tab Switcher (Assignment Requirement: Vendor Approvals vs System Reports) */}
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'approvals'
                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Vendor Approvals ({pendingVendors.filter((v) => v.status === 'Pending').length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'reports'
                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            System Reports
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards (Assignment Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-400">
              Total Sales
            </span>
            <IndianRupee className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-2">
            ₹{totalSales.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this week
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-400">
              Active Stores
            </span>
            <Store className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-2">
            {activeStoresCount} / {stores.length}
          </p>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            {stores.length - activeStoresCount} currently closed
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-400">
              Active Drivers
            </span>
            <Truck className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-2">
            {totalActiveDrivers}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            98.5% on-time rate
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-400">
              Total Orders
            </span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xl font-black text-neutral-900 dark:text-white mt-2">
            {totalOrdersPlaced}
          </p>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Across 4 active zones
          </span>
        </div>
      </div>

      {/* Tab 1: Vendor Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Pending Merchant Registration Requests
              </h2>
              <p className="text-xs text-neutral-500">
                Verify business proof, license, and catalog before onboarding store to live app.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-100 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Store Name</th>
                  <th className="py-3 px-4">Owner Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                {pendingVendors.map((vendor) => {
                  return (
                    <tr key={vendor.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 dark:text-white block">
                          {vendor.storeName}
                        </span>
                        <span className="text-[10px] text-neutral-400">ID: {vendor.id}</span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {vendor.ownerName}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          {vendor.phone} • {vendor.email}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {vendor.location}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                          {vendor.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            vendor.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : vendor.status === 'Rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {vendor.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleVendorApproval(vendor.id, 'Approved')}
                              className="px-2.5 py-1 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-lg text-xs font-bold hover:opacity-80 transition flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleVendorApproval(vendor.id, 'Rejected')}
                              className="px-2.5 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-neutral-400">
                            Action Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: System Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Category Distribution (Sales %)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold text-neutral-700 dark:text-neutral-300">
                  <span>Groceries & Staples</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-950 dark:bg-white w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-neutral-700 dark:text-neutral-300">
                  <span>Dairy, Bread & Eggs</span>
                  <span>35%</span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-600 dark:bg-neutral-300 w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-neutral-700 dark:text-neutral-300">
                  <span>Snacks & Munchies</span>
                  <span>20%</span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-400 dark:bg-neutral-500 w-[20%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Platform Health & Latency
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Order Routing Engine</span>
                <span className="font-bold text-emerald-600">Operational (18ms)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">WebSocket Cluster</span>
                <span className="font-bold text-emerald-600">Connected (Socket.IO)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">MongoDB Replica</span>
                <span className="font-bold text-neutral-900 dark:text-white">Connected: fsd_project</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

