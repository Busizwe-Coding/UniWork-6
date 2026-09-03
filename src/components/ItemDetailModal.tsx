import React, { useState } from 'react';
import { X, Flame, Minus, Plus, ShoppingBag } from 'lucide-react';
import { SushiItem, CartItemOption } from '../types';

interface ItemDetailModalProps {
  item: SushiItem | null;
  onClose: () => void;
  onAddToCart: (item: SushiItem, quantity: number, options: CartItemOption) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [spiciness, setSpiciness] = useState<'Mild' | 'Medium' | 'Signature Hot'>('Medium');
  const [extraWasabi, setExtraWasabi] = useState<boolean>(true);
  const [extraGinger, setExtraGinger] = useState<boolean>(true);
  const [riceType, setRiceType] = useState<'Traditional White' | 'Organic Brown'>('Traditional White');
  const [notes, setNotes] = useState<string>('');

  const handleAdd = () => {
    onAddToCart(item, quantity, {
      spiciness,
      extraWasabi,
      extraGinger,
      riceType,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#e7bcb9] max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full text-[#1a1c1c] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Image */}
        <div className="h-56 relative bg-[#1a1c1c]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="font-mono-caps text-[10px] text-[#bc001f] bg-white px-2.5 py-0.5 font-bold mb-1 inline-block">
              {item.category.toUpperCase()}
            </span>
            <h3 className="font-display text-2xl font-bold text-white">
              {item.name}
            </h3>
            {item.japaneseName && (
              <span className="text-white/70 text-xs font-serif italic">
                {item.japaneseName}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1a1c1c]">
          <p className="font-body text-xs text-[#5f5e5e] leading-relaxed">
            {item.description}
          </p>

          {/* Pricing & Nutritional Badges */}
          <div className="flex items-center gap-4 text-xs font-mono border-y border-gray-100 py-3">
            <div>
              <span className="text-[#5f5e5e]">PRICE:</span>
              <span className="font-bold text-[#bc001f] ml-1.5 text-sm">R{item.price.toFixed(2)}</span>
            </div>
            {item.calories && (
              <div>
                <span className="text-[#5f5e5e]">CALORIES:</span>
                <span className="font-bold ml-1">{item.calories} kcal</span>
              </div>
            )}
            {item.pieces && (
              <div>
                <span className="text-[#5f5e5e]">PIECES:</span>
                <span className="font-bold ml-1">{item.pieces}</span>
              </div>
            )}
          </div>

          {/* Customization 1: Rice Selection */}
          <div>
            <label className="block font-mono-caps text-xs text-[#1a1c1c] mb-2 font-bold">
              1. SUSHI RICE PREFERENCE
            </label>
            <div className="grid grid-cols-2 gap-2 font-body text-xs">
              {(['Traditional White', 'Organic Brown'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiceType(r)}
                  className={`p-2.5 border text-left font-medium transition-all ${
                    riceType === r
                      ? 'border-[#bc001f] bg-[#bc001f]/5 text-[#bc001f]'
                      : 'border-gray-200 text-[#5f5e5e] hover:border-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Customization 2: Spiciness Level */}
          <div>
            <label className="block font-mono-caps text-xs text-[#1a1c1c] mb-2 font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#bc001f]" />
              2. SPICE LEVEL
            </label>
            <div className="grid grid-cols-3 gap-2 font-body text-xs">
              {(['Mild', 'Medium', 'Signature Hot'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpiciness(s)}
                  className={`p-2.5 border text-center font-medium transition-all ${
                    spiciness === s
                      ? 'border-[#bc001f] bg-[#bc001f] text-white'
                      : 'border-gray-200 text-[#5f5e5e] hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Customization 3: Condiments & Sides */}
          <div>
            <label className="block font-mono-caps text-xs text-[#1a1c1c] mb-2 font-bold">
              3. COMPLIMENTARY SIDES
            </label>
            <div className="flex gap-4 text-xs font-body">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extraWasabi}
                  onChange={(e) => setExtraWasabi(e.target.checked)}
                  className="accent-[#bc001f]"
                />
                <span>Fresh Shizuoka Wasabi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extraGinger}
                  onChange={(e) => setExtraGinger(e.target.checked)}
                  className="accent-[#bc001f]"
                />
                <span>Pickled Gari Ginger</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono-caps text-xs text-[#1a1c1c] mb-1 font-bold">
              4. SPECIAL INSTRUCTIONS FOR CHEF
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., No sesame seeds, soy sauce on side..."
              className="w-full border border-gray-200 p-2.5 text-xs focus:outline-none focus:border-[#bc001f]"
            />
          </div>
        </div>

        {/* Modal Footer (Quantity + Add Button) */}
        <div className="p-4 bg-[#f9f9f9] border-t border-[#e7bcb9] flex items-center justify-between gap-4">
          <div className="flex items-center border border-gray-300 bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4 text-[#1a1c1c]" />
            </button>
            <span className="px-4 font-mono font-bold text-sm text-[#1a1c1c]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#1a1c1c]" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-[#bc001f] text-white font-mono-caps text-xs py-3.5 px-6 hover:bg-[#e6192e] transition-all flex items-center justify-center gap-2 font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ADD TO ORDER — R{(item.price * quantity).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
