import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { SushiItem } from '../types';
import { seasonalSpecials } from '../data/sushiData';

interface SeasonalCreationsProps {
  onSelectItem: (item: SushiItem) => void;
  onExploreFullMenu: () => void;
}

export const SeasonalCreations: React.FC<SeasonalCreationsProps> = ({
  onSelectItem,
  onExploreFullMenu
}) => {
  const redDragon = seasonalSpecials[0];
  const tsukiji = seasonalSpecials[1];
  const truffleWagyu = seasonalSpecials[2];
  const matchaMochi = seasonalSpecials[3];

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-16 md:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1a1c1c] mb-2 tracking-tight">
            Seasonal Creations
          </h2>
          <p className="font-body text-[#5f5e5e] text-sm md:text-base">
            Our master chef's monthly selection of premium hand-rolled art.
          </p>
        </div>

        <button
          onClick={onExploreFullMenu}
          className="font-mono-caps text-xs text-[#bc001f] flex items-center gap-2 hover:gap-3 transition-all font-semibold"
        >
          EXPLORE FULL MENU <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[580px]">
        {/* 1. Featured Main (Red Dragon Signature) */}
        {redDragon && (
          <div
            onClick={() => onSelectItem(redDragon)}
            className="md:col-span-2 md:row-span-2 group relative overflow-hidden border border-[#e7bcb9] bg-white hover:border-[#bc001f] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-end"
          >
            <div className="absolute inset-0 w-full h-full">
              <img
                src={redDragon.image}
                alt={redDragon.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
            </div>

            <div className="relative z-10 p-8 w-full">
              <span className="font-mono-caps text-[11px] text-[#bc001f] bg-white px-3 py-1 inline-block mb-3 font-semibold shadow-sm">
                CHEF'S SPECIAL
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-2">
                {redDragon.name}
              </h3>
              <div className="flex justify-between items-center text-white/80 font-mono-caps text-xs">
                <span>FROM R{redDragon.price.toFixed(2)} — {redDragon.collection}</span>
                <button className="bg-[#bc001f] text-white p-2 rounded-full group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Featured Small (Tsukiji Sashimi) */}
        {tsukiji && (
          <div
            onClick={() => onSelectItem(tsukiji)}
            className="md:col-span-2 md:row-span-1 group relative overflow-hidden border border-[#e7bcb9] bg-white hover:border-[#bc001f] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 h-48 md:h-full overflow-hidden relative">
                <img
                  src={tsukiji.image}
                  alt={tsukiji.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#1a1c1c] mb-1">
                    {tsukiji.name}
                  </h3>
                  <p className="font-body text-xs text-[#5f5e5e] line-clamp-2 leading-relaxed mb-3">
                    {tsukiji.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono-caps text-sm text-[#bc001f] font-bold">
                    R{tsukiji.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#5f5e5e] font-mono">
                    {tsukiji.pieces}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Featured Small (Truffle Wagyu) */}
        {truffleWagyu && (
          <div
            onClick={() => onSelectItem(truffleWagyu)}
            className="md:col-span-1 md:row-span-1 group relative overflow-hidden border border-[#e7bcb9] bg-white hover:border-[#bc001f] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="h-40 overflow-hidden relative">
              <img
                src={truffleWagyu.image}
                alt={truffleWagyu.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <h3 className="font-display text-base font-bold text-[#1a1c1c]">
                {truffleWagyu.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="font-mono-caps text-xs text-[#bc001f] font-bold">
                  R{truffleWagyu.price.toFixed(2)} / PC
                </span>
                <Plus className="w-4 h-4 text-[#bc001f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        )}

        {/* 4. Featured Small (Matcha Mochi) */}
        {matchaMochi && (
          <div
            onClick={() => onSelectItem(matchaMochi)}
            className="md:col-span-1 md:row-span-1 group relative overflow-hidden border border-[#e7bcb9] bg-white hover:border-[#bc001f] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="h-40 overflow-hidden relative">
              <img
                src={matchaMochi.image}
                alt={matchaMochi.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <h3 className="font-display text-base font-bold text-[#1a1c1c]">
                {matchaMochi.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="font-mono-caps text-xs text-[#bc001f] font-bold">
                  R{matchaMochi.price.toFixed(2)}
                </span>
                <Plus className="w-4 h-4 text-[#bc001f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
