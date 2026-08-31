import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
  onOpenAiAssistant?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderNow,
  onViewMenu,
  onOpenAiAssistant
}) => {
  return (
    <section className="relative bg-[#ffffff] overflow-hidden min-h-[640px] md:min-h-[720px] flex items-center hero-clip border-b border-[#e7bcb9]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16 md:py-24">
        {/* Left Copy & Actions */}
        <div className="lg:col-span-7 z-10 space-y-6 animate-fade-in">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#bc001f]/10 border border-[#bc001f]/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#bc001f] animate-pulse"></span>
            <span className="font-mono-caps text-[11px] text-[#bc001f] tracking-widest font-semibold">
              AUTHENTIC JAPANESE ARTISTRY
            </span>
          </div>

          {/* Display Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1a1c1c] leading-[1.1] tracking-tight">
            Precision Meets <br />
            <span className="text-[#bc001f] italic font-serif">Flavor.</span>
          </h1>

          {/* Subheading */}
          <p className="font-body text-base sm:text-lg text-[#5f5e5e] max-w-xl leading-relaxed">
            Hand-crafted sushi prepared with editorial precision. Experience the balance of traditional technique and modern minimalist aesthetics.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOrderNow}
              className="bg-[#bc001f] text-white font-mono-caps text-xs px-9 py-4 hover:bg-[#e6192e] transition-all active:scale-95 flex items-center gap-3 group shadow-md"
            >
              ORDER NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onViewMenu}
              className="border-2 border-[#1a1c1c] text-[#1a1c1c] font-mono-caps text-xs px-9 py-4 hover:bg-[#1a1c1c] hover:text-white transition-all active:scale-95"
            >
              VIEW MENU
            </button>

            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="bg-[#1a1c1c] text-white font-mono-caps text-xs px-5 py-4 hover:bg-black transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#bc001f]" />
                <span>AI Sushi Master</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Hero Image / Ninja Salmon Mascot */}
        <div className="lg:col-span-5 relative">
          <div className="relative w-full aspect-square flex items-center justify-center p-4">
            {/* Background Blur Soft Glow */}
            <div className="absolute inset-0 bg-[#bc001f]/10 rounded-full blur-3xl transform scale-90"></div>
            
            {/* Minimal Grid Layer */}
            <div className="absolute inset-0 border border-gray-100 bg-[#f9f9f9]/80 rounded-2xl shadow-inner -z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#1a1c1c_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            {/* Mascot Image from HTML Source */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC82PwOqfk8e2LuH0uddBjY4Dpwys6XT0VeQBf7f5jUyr_w_yB-pgOChmOpoYQPBKwBfK0EVaxrcah2bMMW_zRsXLmIC7KVhRgKOmy15-r84raE7gbGXp7JNGNM5v1JbBDx9zmgpZ1KzirS5qOUxIMiSXikbH1spMesTnCaJVm0atylGPYGXVW2oly2w6SBZoNyQBeXYC200LS_C1GDApGvMWhjEoEwHYlqWZHMNAmBrUECMiotrDPOu--NuNOv9t8OEKS2809tvaG4"
              alt="Nuri Sushi Ninja Salmon Mascot"
              className="w-[85%] h-auto drop-shadow-2xl z-10 animate-bounce-slow object-contain"
            />
          </div>
        </div>
      </div>

      {/* Atmospheric Background Grid */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-[0.03] pointer-events-none hidden lg:block">
        <svg width="100%" height="100%" fill="none">
          <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
    </section>
  );
};
