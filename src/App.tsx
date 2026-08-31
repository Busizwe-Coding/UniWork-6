import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PromoBanner } from './components/PromoBanner';
import { SeasonalCreations } from './components/SeasonalCreations';
import { MenuSection } from './components/MenuSection';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { KitchenKDS } from './components/KitchenKDS';
import { VisualStudioCsharpWorkbench } from './components/VisualStudioCsharpWorkbench';
import { AiSushiMaster } from './components/AiSushiMaster';
import { InnerCircle } from './components/InnerCircle';
import { Footer } from './components/Footer';
import { SushiItem, CartItem, CartItemOption, Order, OrderStatus } from './types';
import { seasonalSpecials } from './data/sushiData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'offers' | 'support' | 'csharp' | 'kitchen'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart & Order State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SushiItem | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  // Orders Management
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'NURI-982103',
      createdAt: '10:15 AM',
      items: [
        {
          cartItemId: 'init-1',
          sushiItem: seasonalSpecials[0],
          quantity: 2,
          options: {
            spiciness: 'Signature Hot',
            extraWasabi: true,
            extraGinger: true,
            riceType: 'Traditional White'
          }
        },
        {
          cartItemId: 'init-2',
          sushiItem: seasonalSpecials[2],
          quantity: 3,
          options: {
            spiciness: 'Mild',
            extraWasabi: true,
            extraGinger: true,
            riceType: 'Traditional White'
          }
        }
      ],
      subtotal: 84.00,
      discount: 16.80,
      deliveryFee: 0,
      total: 67.20,
      status: 'Kitchen',
      customerName: 'Kenji Sato',
      email: 'kenji@ginza-tokyo.jp',
      phone: '+81 90-1234-5678',
      deliveryAddress: '4-2-1 Ginza, Chuo-ku, Tokyo',
      paymentMethod: 'card',
      estimatedMinutes: 25
    }
  ]);

  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0]);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);

  // Cart Operations
  const handleAddToCart = (sushiItem: SushiItem, quantity: number, options: CartItemOption) => {
    const newItem: CartItem = {
      cartItemId: `${sushiItem.id}-${Date.now()}`,
      sushiItem,
      quantity,
      options
    };
    setCart((prev) => [...prev, newItem]);
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleProceedToCheckout = (appliedDiscount: number) => {
    setDiscount(appliedDiscount);
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setCheckoutOpen(false);
    setOrderTrackerOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-body flex flex-col justify-between">
      {/* Top Fixed Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOrderTracker={() => {
          if (activeOrder) setOrderTrackerOpen(true);
          else setActiveTab('kitchen');
        }}
      />

      {/* Main Content Area */}
      <main className="pt-20 flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onOrderNow={() => setActiveTab('menu')}
              onViewMenu={() => setActiveTab('menu')}
              onOpenAiAssistant={() => setAiAssistantOpen(true)}
            />
            <PromoBanner />
            <SeasonalCreations
              onSelectItem={(item) => setSelectedItem(item)}
              onExploreFullMenu={() => setActiveTab('menu')}
            />
            <MenuSection
              onSelectItem={(item) => setSelectedItem(item)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <InnerCircle />
          </>
        )}

        {activeTab === 'menu' && (
          <div className="pt-4">
            <PromoBanner />
            <MenuSection
              onSelectItem={(item) => setSelectedItem(item)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="pt-4 max-w-[1280px] mx-auto px-6 py-12">
            <PromoBanner />
            <div className="mt-8 bg-white border border-[#e7bcb9] p-8 space-y-6">
              <h2 className="font-display text-2xl font-extrabold text-[#1a1c1c]">Exclusive Chef Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#bc001f] p-6 bg-[#bc001f]/5">
                  <span className="font-mono-caps text-xs text-[#bc001f] font-bold">LIMITED TIME</span>
                  <h3 className="font-display text-xl font-bold mt-1">20% Off Your First Order</h3>
                  <p className="font-body text-xs text-[#5f5e5e] mt-2">Use promo code <strong className="font-mono text-[#bc001f]">NURI20</strong> at checkout to apply instant 20% savings on your entire order.</p>
                </div>
                <div className="border border-gray-200 p-6">
                  <span className="font-mono-caps text-xs text-gray-500 font-bold">COMPLIMENTARY</span>
                  <h3 className="font-display text-xl font-bold mt-1">Free Delivery over $50</h3>
                  <p className="font-body text-xs text-[#5f5e5e] mt-2">All orders exceeding $50 automatically qualify for free temperature-controlled courier delivery.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kitchen' && (
          <KitchenKDS orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
        )}

        {activeTab === 'csharp' && (
          <VisualStudioCsharpWorkbench />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Modals & Slide-over Drawers */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        discount={discount}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderTrackerModal
        isOpen={orderTrackerOpen}
        order={activeOrder}
        onClose={() => setOrderTrackerOpen(false)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      <AiSushiMaster
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />
    </div>
  );
}
