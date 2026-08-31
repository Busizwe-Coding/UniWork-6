import React, { useState, useMemo } from 'react';
import { Search, Flame, Plus, Sparkles } from 'lucide-react';
import { SushiItem } from '../types';
import { fullMenu } from '../data/sushiData';

interface MenuSectionProps {
  onSelectItem: (item: SushiItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectItem,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlySpicy, setOnlySpicy] = useState<boolean>(false);
  const [onlyGlutenFree, setOnlyGlutenFree] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Menu' },
    { id: 'rolls', label: 'Artisanal Rolls' },
    { id: 'sashimi', label: 'Sashimi & Raw' },
    { id: 'nigiri', label: 'Nigiri Selection' },
    { id: 'starters', label: 'Warm Starters' },
    { id: 'desserts', label: 'Japanese Desserts' },
    { id: 'beverages', label: 'Sake & Drinks' },
  ];

  const filteredMenu = useMemo(() => {
    return fullMenu.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.japaneseName && item.japaneseName.includes(searchQuery));
      const matchesSpicy = !onlySpicy || item.spicy;
      const matchesGF = !onlyGlutenFree || item.glutenFree;

      return matchesCategory && matchesSearch && matchesSpicy && matchesGF;
    });
  }, [selectedCategory, searchQuery, onlySpicy, onlyGlutenFree]);

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-12">
      {/* Category Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-[#1a1c1c] tracking-tight">
              Gourmet Menu
            </h2>
            <p className="font-body text-xs text-[#5f5e5e] mt-1">
              Curated precision culinary creations available for dine-in & swift delivery.
            </p>
          </div>

          {/* Search bar inside menu */}
          <div className="flex items-center bg-[#eeeeee] rounded-full px-4 py-2 border border-[#e7bcb9] w-full sm:w-64">
            <Search className="w-4 h-4 text-[#5f5e5e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter menu..."
              className="bg-transparent border-none focus:outline-none text-xs px-2 w-full text-[#1a1c1c]"
            />
          </div>
        </div>

        {/* Category Pills & Dietary Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7bcb9] pb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-mono-caps text-xs px-4 py-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#bc001f] text-white font-semibold shadow-sm'
                    : 'bg-[#eeeeee] text-[#1a1c1c] hover:bg-[#e2e2e2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-mono cursor-pointer text-[#1a1c1c]">
              <input
                type="checkbox"
                checked={onlySpicy}
                onChange={(e) => setOnlySpicy(e.target.checked)}
                className="accent-[#bc001f]"
              />
              <Flame className="w-3.5 h-3.5 text-[#bc001f]" />
              <span>Spicy Only</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs font-mono cursor-pointer text-[#1a1c1c]">
              <input
                type="checkbox"
                checked={onlyGlutenFree}
                onChange={(e) => setOnlyGlutenFree(e.target.checked)}
                className="accent-[#bc001f]"
              />
              <Sparkles className="w-3.5 h-3.5 text-[#bc001f]" />
              <span>Gluten-Free</span>
            </label>
          </div>
        </div>
      </div>

      {/* Menu Cards Grid */}
      {filteredMenu.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#e7bcb9] p-8">
          <p className="font-display text-lg text-[#1a1c1c] font-bold">No sushi items match your current search.</p>
          <p className="text-xs text-[#5f5e5e] mt-1 font-body">Try clearing your filters or searching for something else.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setOnlySpicy(false); setOnlyGlutenFree(false); }}
            className="mt-4 bg-[#bc001f] text-white font-mono-caps text-xs px-6 py-2.5"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group border border-[#e7bcb9] bg-white hover:border-[#bc001f] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                {/* Image */}
                <div className="h-48 overflow-hidden relative bg-[#f3f3f4]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.isChefSpecial && (
                    <span className="absolute top-3 left-3 bg-[#bc001f] text-white font-mono-caps text-[10px] px-2.5 py-1 font-semibold">
                      CHEF'S SPECIAL
                    </span>
                  )}
                  {item.spicy && (
                    <span className="absolute top-3 right-3 bg-[#1a1c1c] text-white p-1 rounded-full">
                      <Flame className="w-3.5 h-3.5 text-[#bc001f]" />
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-display text-lg font-bold text-[#1a1c1c] group-hover:text-[#bc001f] transition-colors">
                      {item.name}
                    </h3>
                    {item.japaneseName && (
                      <span className="text-xs text-[#5f5e5e] font-serif">
                        {item.japaneseName}
                      </span>
                    )}
                  </div>

                  <p className="font-body text-xs text-[#5f5e5e] leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <div>
                  <span className="font-mono-caps text-sm text-[#bc001f] font-extrabold">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.pieces && (
                    <span className="text-[11px] text-[#5f5e5e] font-mono ml-2">
                      ({item.pieces})
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="bg-[#1a1c1c] text-white p-2 hover:bg-[#bc001f] transition-colors"
                  title="Customize & Add"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
