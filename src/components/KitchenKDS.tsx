import React, { useState } from 'react';
import { ChefHat, Flame, CheckCircle, Clock, Bike, AlertCircle, Play } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface KitchenKDSProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const KitchenKDS: React.FC<KitchenKDSProps> = ({ orders, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => filterStatus === 'all' || o.status === filterStatus);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingPrepCount = orders.filter((o) => o.status === 'Received' || o.status === 'Kitchen').length;

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-12">
      {/* Kitchen Banner */}
      <div className="bg-[#1a1c1c] text-white p-6 border-b-4 border-[#bc001f] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#bc001f] font-mono-caps text-xs">
            <ChefHat className="w-5 h-5" />
            <span>NURI SUSHI KITCHEN DISPLAY SYSTEM (KDS)</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold mt-1">Master Chef Order Preparation Console</h2>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="bg-white/10 px-4 py-2 text-center">
            <span className="text-white/60 block text-[10px]">PENDING PREP</span>
            <span className="text-lg font-bold text-[#bc001f]">{pendingPrepCount} Orders</span>
          </div>
          <div className="bg-white/10 px-4 py-2 text-center">
            <span className="text-white/60 block text-[10px]">TODAY'S REVENUE</span>
            <span className="text-lg font-bold text-emerald-400">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#e7bcb9] pb-3">
        {['all', 'Received', 'Kitchen', 'Seared', 'Delivery', 'Delivered'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`font-mono-caps text-xs px-4 py-2 transition-all ${
              filterStatus === st
                ? 'bg-[#bc001f] text-white font-bold'
                : 'bg-[#eeeeee] text-[#1a1c1c] hover:bg-[#e2e2e2]'
            }`}
          >
            {st.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#e7bcb9] p-8">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <p className="font-display font-bold text-lg text-[#1a1c1c]">No active orders in this queue stage.</p>
          <p className="text-xs text-[#5f5e5e] mt-1 font-body">All incoming customer sushi orders will appear here in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className={`bg-white border-2 p-5 flex flex-col justify-between shadow-sm transition-all ${
                ord.status === 'Received' ? 'border-[#bc001f]' : 'border-[#e7bcb9]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b border-gray-100 mb-3">
                  <div>
                    <span className="font-mono-caps text-xs font-bold text-[#bc001f] block">
                      #{ord.id}
                    </span>
                    <span className="font-display font-bold text-sm text-[#1a1c1c]">
                      {ord.customerName}
                    </span>
                  </div>
                  <span className={`font-mono-caps text-[10px] px-2.5 py-1 font-bold ${
                    ord.status === 'Received' ? 'bg-red-100 text-red-800' :
                    ord.status === 'Kitchen' ? 'bg-amber-100 text-amber-800' :
                    ord.status === 'Seared' ? 'bg-orange-100 text-orange-800' :
                    ord.status === 'Delivery' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ord.status.toUpperCase()}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4 font-mono text-xs">
                  {ord.items.map((item) => (
                    <div key={item.cartItemId} className="bg-gray-50 p-2.5 border border-gray-200">
                      <div className="flex justify-between font-bold text-[#1a1c1c]">
                        <span>{item.quantity}x {item.sushiItem.name}</span>
                        <span>${(item.sushiItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] text-[#5f5e5e] mt-0.5">
                        Rice: {item.options.riceType} | Spice: <strong className="text-[#bc001f]">{item.options.spiciness}</strong>
                      </div>
                      {item.options.notes && (
                        <div className="text-[10px] text-red-600 bg-red-50 p-1 mt-1 font-sans italic border border-red-100">
                          Note: "{item.options.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Action Button */}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-[#bc001f]">
                  ${ord.total.toFixed(2)}
                </span>

                {ord.status === 'Received' && (
                  <button
                    onClick={() => onUpdateStatus(ord.id, 'Kitchen')}
                    className="bg-[#bc001f] text-white font-mono-caps text-[11px] px-3 py-1.5 hover:bg-[#e6192e] flex items-center gap-1 font-bold"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Rolling
                  </button>
                )}
                {ord.status === 'Kitchen' && (
                  <button
                    onClick={() => onUpdateStatus(ord.id, 'Seared')}
                    className="bg-orange-600 text-white font-mono-caps text-[11px] px-3 py-1.5 hover:bg-orange-700 flex items-center gap-1 font-bold"
                  >
                    <Flame className="w-3.5 h-3.5" /> Torch & Plated
                  </button>
                )}
                {ord.status === 'Seared' && (
                  <button
                    onClick={() => onUpdateStatus(ord.id, 'Delivery')}
                    className="bg-blue-600 text-white font-mono-caps text-[11px] px-3 py-1.5 hover:bg-blue-700 flex items-center gap-1 font-bold"
                  >
                    <Bike className="w-3.5 h-3.5" /> Dispatch Courier
                  </button>
                )}
                {ord.status === 'Delivery' && (
                  <button
                    onClick={() => onUpdateStatus(ord.id, 'Delivered')}
                    className="bg-emerald-600 text-white font-mono-caps text-[11px] px-3 py-1.5 hover:bg-emerald-700 flex items-center gap-1 font-bold"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Complete Order
                  </button>
                )}
                {ord.status === 'Delivered' && (
                  <span className="font-mono text-xs text-emerald-600 font-bold">✓ DELIVERED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
