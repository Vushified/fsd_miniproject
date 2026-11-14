import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Check, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  Clock,
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Modal } from '../components/Modal';

// View 3: Checkout Page
// Finalize delivery address and payment option
export function CheckoutPage({ onBack, onOrderPlaced }) {
  const {
    cart,
    subtotal,
    deliveryFee,
    handlingFee,
    grandTotal,
    savedAddresses,
    setSavedAddresses,
    selectedAddress,
    setSelectedAddress,
    placeOrder,
  } = useCart();

  // Selected payment mode (UPI, Card, COD)
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form error state
  const [formErrors, setFormErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);

  // Add Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');

  // Handle adding new address
  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      address: newAddressText.trim(),
      isDefault: false,
    };

    setSavedAddresses((prev) => [...prev, newAddr]);
    setSelectedAddress(newAddr);
    setNewAddressText('');
    setIsAddressModalOpen(false);
  };

  // Form validation before placing order
  const validateForm = () => {
    const errors = {};
    if (!selectedAddress) {
      errors.address = 'Please select a delivery address.';
    }
    if (paymentMethod === 'UPI') {
      if (!upiId.trim() || !upiId.includes('@')) {
        errors.upi = 'Please enter a valid UPI ID (e.g. vidushi@okhdfcbank).';
      }
    }
    if (paymentMethod === 'Card') {
      if (cardNumber.replace(/\s+/g, '').length < 16) {
        errors.card = 'Card number must be 16 digits.';
      }
      if (!cardExpiry.includes('/')) {
        errors.expiry = 'Expiry must be in MM/YY format.';
      }
      if (cardCvv.length < 3) {
        errors.cvv = 'CVV must be 3 digits.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Order
  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    setIsPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        paymentMethod,
        deliveryAddress: selectedAddress,
      });
      setIsPlacing(false);
      onOrderPlaced(order);
    }, 1200); // Realistic 1.2s processing simulation
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Your cart is empty
        </h2>
        <p className="text-xs text-neutral-500">
          Add some delicious snacks or fresh groceries to proceed!
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-semibold"
        >
          Browse Stores
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-neutral-500">
            Estimated delivery in <span className="font-semibold text-neutral-900 dark:text-white">10-15 minutes</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Address and Payment (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h2>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Address
              </button>
            </div>

            {formErrors.address && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {formErrors.address}
              </p>
            )}

            {/* Saved Address List */}
            <div className="space-y-2">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`cursor-pointer p-3.5 rounded-xl border text-xs transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/60'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.2 rounded font-semibold text-neutral-700 dark:text-neutral-300">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        {addr.address}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                          : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Payment Mode Selector (UPI, Card, COD) */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </h2>

            {/* Payment Mode Options */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'Card', label: 'Card', icon: CreditCard },
                { id: 'COD', label: 'Pay on Delivery', icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.id);
                      setFormErrors({});
                    }}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* UPI Input Details */}
            {paymentMethod === 'UPI' && (
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. vidushi@upi or mobile@paytm"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
                {formErrors.upi && (
                  <p className="text-[11px] text-red-500">{formErrors.upi}</p>
                )}
                <p className="text-[10px] text-neutral-400">
                  Popular: Google Pay, PhonePe, Paytm, BHIM UPI
                </p>
              </div>
            )}

            {/* Card Input Details */}
            {paymentMethod === 'Card' && (
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none"
                  />
                  {formErrors.card && (
                    <p className="text-[11px] text-red-500 mt-0.5">{formErrors.card}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/28"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none"
                    />
                    {formErrors.expiry && (
                      <p className="text-[11px] text-red-500 mt-0.5">{formErrors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none"
                    />
                    {formErrors.cvv && (
                      <p className="text-[11px] text-red-500 mt-0.5">{formErrors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* COD Info */}
            {paymentMethod === 'COD' && (
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-900 dark:text-white" />
                <span>Please keep cash or UPI ready when delivery partner arrives.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Order item summary & Bill breakdown (1 col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Order Summary ({cart.length} items)
            </h2>

            {/* Item checklist preview */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-100 dark:divide-neutral-800">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill breakdown */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-neutral-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-semibold uppercase text-[10px]">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Handling Fee</span>
                <span>₹{handlingFee}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-sm font-black text-neutral-900 dark:text-white">
                <span>To Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:opacity-90 transition active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPlacing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <span>Place Order • ₹{grandTotal}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-400 text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span>Safe & Secure 256-Bit Encrypted Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Address */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add Delivery Address"
      >
        <form onSubmit={handleAddNewAddress} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Address Label
            </label>
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setNewLabel(lbl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    newLabel === lbl
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-transparent'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Complete Street Address
            </label>
            <textarea
              rows={3}
              required
              value={newAddressText}
              onChange={(e) => setNewAddressText(e.target.value)}
              placeholder="House/Flat No., Apartment Name, Street, Landmark, Pin code"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-lg transition shadow-sm"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

