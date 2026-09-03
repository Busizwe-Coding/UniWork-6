import React from 'react';
import { Star, Truck, Leaf } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <section className="bg-[#1a1c1c] py-4 overflow-hidden border-y border-[#bc001f]/30">
      <div className="max-w-[1280px] mx-auto overflow-hidden relative">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          <span className="font-mono-caps text-xs text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-[#bc001f] fill-[#bc001f]" />
            FIRST ORDER 20% OFF WITH CODE: <strong className="text-[#bc001f] tracking-widest font-bold">NURI20</strong>
          </span>

          <span className="text-white/30 font-mono text-xs">|</span>

          <span className="font-mono-caps text-xs text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#bc001f]" />
            FREE DELIVERY ON ORDERS OVER R500
          </span>

          <span className="text-white/30 font-mono text-xs">|</span>

          <span className="font-mono-caps text-xs text-white flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#bc001f]" />
            SUSTAINABLY SOURCED DAILY FROM TOKYO & NORWAY
          </span>

          <span className="text-white/30 font-mono text-xs">|</span>

          {/* Duplicated for continuous smooth marquee loop */}
          <span className="font-mono-caps text-xs text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-[#bc001f] fill-[#bc001f]" />
            FIRST ORDER 20% OFF WITH CODE: <strong className="text-[#bc001f] tracking-widest font-bold">NURI20</strong>
          </span>

          <span className="text-white/30 font-mono text-xs">|</span>

          <span className="font-mono-caps text-xs text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#bc001f]" />
            FREE DELIVERY ON ORDERS OVER R500
          </span>
        </div>
      </div>
    </section>
  );
};
