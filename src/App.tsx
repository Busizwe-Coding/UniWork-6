import React, { useEffect, useState } from 'react';
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
import { CustomerSupportSystem } from './components/CustomerSupportSystem';
import { InnerCircle } from './components/InnerCircle';
import { Footer } from './components/Footer';
import { SushiItem, CartItem, CartItemOption, Order, OrderStatus, ComplaintTicket, ComplaintStatus } from './types';
import { seasonalSpecials, fullMenu } from './data/sushiData';
import { initialComplaints } from './data/complaintsData';
import { AuthUser } from './api/auth';
import { ordersApi } from './api/orders';

interface AppProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function App({ user, onLogout }: AppProps) {
  const isAdmin = user.role === 'admin';
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'offers' | 'support' | 'csharp' | 'kitchen'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart & Order State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SushiItem | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  // Complaints & Support Tickets State
  const [tickets, setTickets] = useState<ComplaintTicket[]>(initialComplaints);
  const [supportInitialOrderId] = useState<string>('');

  // Orders Management
  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState<boolean>(false);

  // Orders live on the server: load them on sign-in and refresh every few seconds
  // so the admin's Kitchen KDS sees new orders and customers see status changes.
  useEffect(() => {
    let alive = true;
    const load = () =>
      ordersApi
        .list()
        .then((list) => alive && setOrders(list))
        .catch(() => {});
    load();
    const timer = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

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

  const handlePlaceOrder = async (draft: Order) => {
    const saved = await ordersApi.create({ ...draft, discount });
    setOrders((prev) => [saved, ...prev.filter((o) => o.id !== saved.id)]);
    setSelectedOrderId(saved.id);
    setCart([]);
    setCheckoutOpen(false);
    setOrderTrackerOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    if (!isAdmin) return;
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    ordersApi.setStatus(orderId, newStatus).catch(() => setOrders(previous));
  };

  // Support & Complaint Ticket Handlers
  const handleAddTicket = (ticket: ComplaintTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: ComplaintStatus, notes?: string, comp?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            resolutionNotes: notes !== undefined ? notes : t.resolutionNotes,
            compensationGranted: comp !== undefined ? comp : t.compensationGranted
          };
        }
        return t;
      })
    );
  };

  const handleAddTicketMessage = (
    ticketId: string,
    sender: 'customer' | 'support' | 'executive_chef',
    senderName: string,
    message: string,
    roleTitle?: string
  ) => {
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender,
      senderName,
      roleTitle,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, messages: [...t.messages, newMsg] } : t))
    );
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
        onOpenOrderTracker={() => setOrderTrackerOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <main className="pt-20 flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onOrderNow={() => setActiveTab('menu')}
              onViewMenu={() => setActiveTab('menu')}
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
                  <p className="font-body text-xs text-[#5f5e5e] mt-2">Use promo code <strong className="font-mono text-[#bc001f]">MOORI20</strong> at checkout to apply instant 20% savings on your entire order.</p>
                </div>
                <div className="border border-gray-200 p-6">
                  <span className="font-mono-caps text-xs text-gray-500 font-bold">COMPLIMENTARY</span>
                  <h3 className="font-display text-xl font-bold mt-1">Free Delivery over R500</h3>
                  <p className="font-body text-xs text-[#5f5e5e] mt-2">All orders exceeding R500 automatically qualify for free temperature-controlled courier delivery.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <CustomerSupportSystem
            tickets={tickets}
            orders={orders}
            onAddTicket={handleAddTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onAddTicketMessage={handleAddTicketMessage}
            initialOrderId={supportInitialOrderId}
          />
        )}

        {activeTab === 'kitchen' && isAdmin && (
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
        orders={orders}
        selectedOrderId={selectedOrderId}
        onSelectOrder={setSelectedOrderId}
        onClose={() => setOrderTrackerOpen(false)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onLogout={onLogout}
      />
    </div>
  );
}
