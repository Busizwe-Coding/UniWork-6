import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discount: number;
  onPlaceOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discount,
  onPlaceOrder
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'cash'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.sushiItem.price * i.quantity, 0);
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 50.00;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `MOORI-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        subtotal,
        discount,
        deliveryFee,
        total,
        status: 'Received',
        customerName: name,
        email,
        phone,
        deliveryAddress: address,
        paymentMethod,
        estimatedMinutes: 35
      };

      setIsSubmitting(false);
      onPlaceOrder(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#e7bcb9] max-w-xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#f9f9f9] border-b border-[#e7bcb9] flex justify-between items-center">
          <div>
            <span className="font-mono-caps text-[10px] text-[#bc001f] font-bold">SECURE CHECKOUT</span>
            <h2 className="font-display text-xl font-bold text-[#1a1c1c]">Order Summary & Delivery</h2>
          </div>
          <button onClick={onClose} className="p-2 text-[#5f5e5e] hover:text-[#1a1c1c]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1a1c1c]">
          {/* Contact & Delivery */}
          <div className="space-y-4">
            <h3 className="font-mono-caps text-xs font-bold border-b border-gray-100 pb-2 text-[#bc001f]">
              1. CONTACT & DELIVERY LOCATION
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-mono text-[11px] text-[#5f5e5e] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 focus:border-[#bc001f] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#5f5e5e] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 focus:border-[#bc001f] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#5f5e5e] mb-1">Delivery Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 p-2.5 focus:border-[#bc001f] focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <h3 className="font-mono-caps text-xs font-bold border-b border-gray-100 pb-2 text-[#bc001f]">
              2. PAYMENT METHOD
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'applepay', label: 'Apple Pay', icon: ShieldCheck },
                { id: 'cash', label: 'Cash on Delivery', icon: CheckCircle2 }
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === p.id
                        ? 'border-[#bc001f] bg-[#bc001f]/5 text-[#bc001f] font-bold'
                        : 'border-gray-200 text-[#5f5e5e] hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="bg-[#f9f9f9] p-4 border border-gray-200 font-mono text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#5f5e5e]">Items Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#bc001f]">
                <span>Discount Applied</span>
                <span>-R{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#5f5e5e]">Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `R${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#1a1c1c] pt-2 border-t border-gray-200">
              <span>ESTIMATED TOTAL</span>
              <span className="text-[#bc001f]">R{total.toFixed(2)}</span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-[#f9f9f9] border-t border-[#e7bcb9]">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#bc001f] text-white font-mono-caps text-xs py-4 hover:bg-[#e6192e] transition-all flex items-center justify-center gap-2 font-bold shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>SENDING ORDER TO KITCHEN...</span>
            ) : (
              <span>CONFIRM ORDER — R{total.toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
