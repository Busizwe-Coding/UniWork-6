import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, ShoppingBag, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedDiscount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string>('');

  const subtotal = cart.reduce((acc, item) => acc + item.sushiItem.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.20 : 0;
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 50.00;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'MOORI20') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "MOORI20" for 20% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e7bcb9] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#f9f9f9] border-b border-[#e7bcb9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#bc001f]" />
              <h2 className="font-display text-xl font-extrabold text-[#1a1c1c]">
                Your Order Bag
              </h2>
              <span className="font-mono text-xs bg-[#bc001f] text-white px-2 py-0.5 rounded-full ml-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#5f5e5e] hover:text-[#1a1c1c] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-[#5f5e5e] space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="font-display font-bold text-lg text-[#1a1c1c]">Your bag is empty.</p>
                <p className="font-body text-xs">Explore our seasonal hand-rolled creations and add items.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.sushiItem.image}
                    alt={item.sushiItem.name}
                    className="w-16 h-16 object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-bold text-[#1a1c1c] truncate">
                      {item.sushiItem.name}
                    </h4>
                    <p className="font-mono text-xs text-[#bc001f] font-bold">
                      R{item.sushiItem.price.toFixed(2)}
                    </p>
                    <p className="font-body text-[11px] text-[#5f5e5e] truncate">
                      {item.options.riceType} • {item.options.spiciness} Spice
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-gray-400 hover:text-[#bc001f] transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Promo Code */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#f9f9f9] border-t border-[#e7bcb9] space-y-4">
              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PROMO CODE (MOORI20)"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#bc001f]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1a1c1c] text-white font-mono-caps text-xs px-4 hover:bg-[#bc001f] transition-colors"
                >
                  APPLY
                </button>
              </form>

              {promoApplied && (
                <p className="text-xs font-mono text-emerald-700 bg-emerald-50 p-2 border border-emerald-200">
                  ✓ Code MOORI20 applied! 20% discount added.
                </p>
              )}
              {promoError && (
                <p className="text-xs font-mono text-red-600">
                  {promoError}
                </p>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 font-mono text-xs border-y border-gray-200 py-3 text-[#1a1c1c]">
                <div className="flex justify-between">
                  <span className="text-[#5f5e5e]">Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-[#bc001f]">
                    <span>Discount (20% OFF)</span>
                    <span>-R{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#5f5e5e]">Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `R${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#1a1c1c] pt-2 border-t border-gray-200">
                  <span>TOTAL</span>
                  <span className="text-[#bc001f]">R{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout(discount);
                }}
                className="w-full bg-[#bc001f] text-white font-mono-caps text-xs py-4 hover:bg-[#e6192e] transition-all flex items-center justify-center gap-2 font-bold shadow-md"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
