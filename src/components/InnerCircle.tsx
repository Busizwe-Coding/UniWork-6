import React, { useState } from 'react';
import { Utensils, Check } from 'lucide-react';

export const InnerCircle: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className="bg-[#f3f3f4] py-20 mb-12 border-y border-[#e7bcb9]">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-12 bg-[#bc001f]/10 text-[#bc001f] rounded-full flex items-center justify-center mx-auto">
            <Utensils className="w-6 h-6" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1a1c1c]">
            The Nuri Inner Circle
          </h2>

          <p className="font-body text-[#5f5e5e] text-sm md:text-base leading-relaxed">
            Join our exclusive mailing list for secret menu access, first-look at seasonal drops, and private Tokyo dining events.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 mt-8 border border-[#e7bcb9]">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL ADDRESS"
              className="flex-grow px-6 py-4 bg-white border-none focus:outline-none text-xs font-mono text-[#1a1c1c] placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-[#1a1c1c] text-white px-10 py-4 font-mono-caps text-xs hover:bg-[#bc001f] transition-colors uppercase tracking-widest font-bold"
            >
              SUBSCRIBE
            </button>
          </form>

          {subscribed && (
            <p className="text-xs font-mono text-emerald-700 bg-emerald-50 p-2 border border-emerald-200 flex items-center justify-center gap-1">
              <Check className="w-4 h-4" /> Welcome to the Nuri Inner Circle! Secret drops will arrive in your inbox.
            </p>
          )}

          <p className="text-[10px] text-[#5f5e5e]/80 font-mono-caps">
            BY SUBSCRIBING YOU AGREE TO OUR PRIVACY POLICY AND TERMS OF SERVICE.
          </p>
        </div>
      </div>
    </section>
  );
};
