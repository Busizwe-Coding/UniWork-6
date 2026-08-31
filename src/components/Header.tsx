import React, { useState } from 'react';
import { ShoppingBag, Search, ChefHat, User, Menu as MenuIcon, X } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'menu' | 'offers' | 'support' | 'csharp' | 'kitchen';
  setActiveTab: (tab: 'home' | 'menu' | 'offers' | 'support' | 'csharp' | 'kitchen') => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenOrderTracker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  onOpenOrderTracker
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#f9f9f9] border-b border-[#e7bcb9] fixed top-0 w-full z-50 transition-all duration-200">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1280px] mx-auto">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('home')} 
            className="text-2xl font-extrabold text-[#bc001f] tracking-tight font-display hover:opacity-90 transition-opacity"
          >
            Nuri Sushi
          </button>
          
          <nav className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`font-mono-caps text-xs py-1 transition-colors ${
                activeTab === 'home'
                  ? 'text-[#bc001f] border-b-2 border-[#bc001f] font-semibold'
                  : 'text-[#5f5e5e] hover:text-[#bc001f]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`font-mono-caps text-xs py-1 transition-colors ${
                activeTab === 'menu'
                  ? 'text-[#bc001f] border-b-2 border-[#bc001f] font-semibold'
                  : 'text-[#5f5e5e] hover:text-[#bc001f]'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`font-mono-caps text-xs py-1 transition-colors ${
                activeTab === 'offers'
                  ? 'text-[#bc001f] border-b-2 border-[#bc001f] font-semibold'
                  : 'text-[#5f5e5e] hover:text-[#bc001f]'
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`font-mono-caps text-xs py-1 transition-colors flex items-center gap-1 ${
                activeTab === 'kitchen'
                  ? 'text-[#bc001f] border-b-2 border-[#bc001f] font-semibold'
                  : 'text-[#5f5e5e] hover:text-[#bc001f]'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              Kitchen KDS
            </button>
          </nav>
        </div>

        {/* Search, Action Buttons & Order Now */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden lg:flex items-center bg-[#eeeeee] rounded-full px-4 py-1.5 border border-[#e7bcb9] transition-all focus-within:border-[#bc001f]">
            <Search className="w-4 h-4 text-[#5f5e5e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'menu') setActiveTab('menu');
              }}
              placeholder="Search sushi..."
              className="bg-transparent border-none focus:outline-none text-xs px-2 w-32 focus:w-44 transition-all text-[#1a1c1c] placeholder:text-[#5f5e5e]/60"
            />
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#5f5e5e] hover:text-[#bc001f] transition-colors rounded-full hover:bg-black/5"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#bc001f] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Order Tracker */}
          <button
            onClick={onOpenOrderTracker}
            className="p-2 text-[#5f5e5e] hover:text-[#bc001f] transition-colors rounded-full hover:bg-black/5"
            title="Track Order Status"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Primary Order Now Button */}
          <button
            onClick={() => setActiveTab('menu')}
            className="hidden md:block bg-[#bc001f] text-white font-mono-caps text-xs px-6 py-2.5 rounded-full hover:bg-[#e6192e] active:scale-95 transition-all shadow-sm"
          >
            Order Now
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1a1c1c]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e7bcb9] px-6 py-4 flex flex-col gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center bg-[#eeeeee] rounded-full px-4 py-2 border border-[#e7bcb9] mb-2">
            <Search className="w-4 h-4 text-[#5f5e5e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'menu') setActiveTab('menu');
              }}
              placeholder="Search sushi..."
              className="bg-transparent border-none focus:outline-none text-sm px-2 w-full text-[#1a1c1c]"
            />
          </div>

          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="font-mono-caps text-sm text-left py-2 border-b border-gray-100 font-medium"
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
            className="font-mono-caps text-sm text-left py-2 border-b border-gray-100 font-medium text-[#bc001f]"
          >
            Menu & Creations
          </button>
          <button
            onClick={() => { setActiveTab('offers'); setMobileMenuOpen(false); }}
            className="font-mono-caps text-sm text-left py-2 border-b border-gray-100 font-medium"
          >
            Offers & Promo Codes
          </button>
          <button
            onClick={() => { setActiveTab('kitchen'); setMobileMenuOpen(false); }}
            className="font-mono-caps text-sm text-left py-2 text-[#1a1c1c] font-medium flex items-center gap-2"
          >
            <ChefHat className="w-4 h-4 text-[#bc001f]" />
            Kitchen KDS Display
          </button>
        </div>
      )}
    </header>
  );
};
