import React, { useState, useEffect } from 'react';
import { X, ChefHat, Bike, CheckCircle, Clock, MapPin, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onReportIssue?: (orderId: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  order,
  onClose,
  onUpdateOrderStatus,
  onReportIssue
}) => {
  if (!isOpen || !order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [timeLeft, setTimeLeft] = useState<number>(order.estimatedMinutes * 60);

  useEffect(() => {
    setCurrentStatus(order.status);
  }, [order]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'Received', label: 'Order Confirmed', icon: Clock },
    { status: 'Kitchen', label: 'Chef Rolling', icon: ChefHat },
    { status: 'Seared', label: 'Torch Seared & Plated', icon: ChefHat },
    { status: 'Delivery', label: 'Driver En Route', icon: Bike },
    { status: 'Delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Received': return 0;
      case 'Kitchen': return 1;
      case 'Seared': return 2;
      case 'Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  const handleAdvanceStatus = () => {
    const orderFlow: OrderStatus[] = ['Received', 'Kitchen', 'Seared', 'Delivery', 'Delivered'];
    const nextIdx = Math.min(orderFlow.length - 1, currentStepIdx + 1);
    const nextStatus = orderFlow[nextIdx];
    setCurrentStatus(nextStatus);
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#e7bcb9] max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#1a1c1c] text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#bc001f] animate-ping"></span>
              <span className="font-mono-caps text-xs text-[#bc001f] font-bold">REAL-TIME ORDER TRACKER</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold mt-1">
              Order #{order.id}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1a1c1c]">
          {/* Estimated Time Card */}
          <div className="bg-[#f9f9f9] border border-[#e7bcb9] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-mono-caps text-xs text-[#5f5e5e]">ESTIMATED ARRIVAL TIME</span>
              <p className="font-display text-3xl font-extrabold text-[#bc001f] mt-1 font-mono">
                {currentStatus === 'Delivered' ? 'ARRIVED!' : formatTime(timeLeft)}
              </p>
              <p className="font-body text-xs text-[#5f5e5e] mt-1">
                Delivering to: <strong className="text-[#1a1c1c]">{order.deliveryAddress}</strong>
              </p>
            </div>

            <button
              onClick={handleAdvanceStatus}
              className="bg-[#1a1c1c] text-white font-mono-caps text-[11px] px-4 py-2.5 hover:bg-[#bc001f] transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Advance Status (Sim)</span>
            </button>
          </div>

          {/* Progress Timeline Bar */}
          <div>
            <h3 className="font-mono-caps text-xs font-bold mb-4 text-[#1a1c1c]">
              PREPARATION TIMELINE
            </h3>
            
            <div className="relative flex items-center justify-between">
              {/* Connecting Bar */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[#bc001f] -translate-y-1/2 transition-all duration-500 -z-10" 
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, idx) => {
                const isComplete = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const StepIcon = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center bg-white px-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isComplete 
                        ? 'bg-[#bc001f] text-white shadow-md' 
                        : 'bg-gray-100 text-gray-400 border border-gray-300'
                    } ${isCurrent ? 'ring-4 ring-[#bc001f]/20 scale-110' : ''}`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className={`font-mono text-[10px] mt-2 text-center max-w-[80px] ${
                      isComplete ? 'font-bold text-[#1a1c1c]' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier & Delivery Map Simulation */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xs flex items-center gap-4">
            <div className="bg-[#bc001f]/10 p-3 text-[#bc001f]">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1 text-xs">
              <span className="font-mono-caps font-bold text-[#1a1c1c]">GINZA EXPRESS COURIER</span>
              <p className="font-body text-[#5f5e5e] text-[11px]">
                Driver Takeshi K. is assigned. Temperature-controlled wooden sushi box active.
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="font-mono-caps text-xs font-bold mb-2 text-[#1a1c1c]">ORDERED ITEMS</h4>
            <div className="border border-gray-200 divide-y divide-gray-100 text-xs font-mono">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="p-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#1a1c1c]">{item.quantity}x {item.sushiItem.name}</span>
                    <span className="text-[11px] text-[#5f5e5e] block">{item.options.riceType} • {item.options.spiciness}</span>
                  </div>
                  <span className="font-bold text-[#bc001f]">
                    R{(item.sushiItem.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f9f9f9] border-t border-[#e7bcb9] flex flex-wrap gap-2 justify-between items-center text-xs font-mono">
          <span>TOTAL PAID: <strong className="text-[#bc001f] text-sm ml-1">R{order.total.toFixed(2)}</strong></span>
          <div className="flex gap-2">
            {onReportIssue && (
              <button
                type="button"
                onClick={() => onReportIssue(order.id)}
                className="bg-white border border-[#bc001f] text-[#bc001f] font-mono-caps text-xs px-4 py-2 hover:bg-[#bc001f] hover:text-white transition-colors"
              >
                Report Issue / Photo Proof
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-[#1a1c1c] text-white font-mono-caps text-xs px-6 py-2 hover:bg-[#bc001f]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
