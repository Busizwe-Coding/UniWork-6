import React from 'react';
import { Share2, Camera, MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'menu' | 'offers' | 'support' | 'csharp' | 'kitchen') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-[#e7bcb9] pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand & Mission */}
        <div className="space-y-4">
          <div className="text-2xl font-extrabold text-[#bc001f] tracking-tight font-display">
            Nuri Sushi
          </div>
          <p className="font-body text-xs text-[#5f5e5e] leading-relaxed">
            Bringing the precision of traditional sushi craft to the modern digital era. Quality first, always.
          </p>
          <div className="flex gap-3">
            <button className="w-9 h-9 flex items-center justify-center border border-[#e7bcb9] text-[#5f5e5e] hover:border-[#bc001f] hover:text-[#bc001f] transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center border border-[#e7bcb9] text-[#5f5e5e] hover:border-[#bc001f] hover:text-[#bc001f] transition-all">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-mono-caps text-xs font-bold mb-4 text-[#1a1c1c] border-b-2 border-[#bc001f] w-fit pr-4 pb-1">
            NAVIGATION
          </h4>
          <ul className="space-y-2.5 font-body text-xs text-[#5f5e5e]">
            <li>
              <button onClick={() => onNavigate('menu')} className="hover:text-[#bc001f] transition-colors">
                Our Menu
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-[#bc001f] transition-colors">
                Seasonal Specials
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('kitchen')} className="hover:text-[#bc001f] transition-colors">
                Kitchen KDS Console
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('csharp')} className="hover:text-[#bc001f] transition-colors font-bold text-[#1a1c1c]">
                Visual Studio C# Solution
              </button>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-mono-caps text-xs font-bold mb-4 text-[#1a1c1c] border-b-2 border-[#bc001f] w-fit pr-4 pb-1">
            SUPPORT
          </h4>
          <ul className="space-y-2.5 font-body text-xs text-[#5f5e5e]">
            <li><a href="#support" className="hover:text-[#bc001f] transition-colors">Contact Us</a></li>
            <li><a href="#privacy" className="hover:text-[#bc001f] transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-[#bc001f] transition-colors">Terms of Service</a></li>
            <li><a href="#track" className="hover:text-[#bc001f] transition-colors">Track Order</a></li>
          </ul>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-mono-caps text-xs font-bold mb-4 text-[#1a1c1c] border-b-2 border-[#bc001f] w-fit pr-4 pb-1">
            LOCATION
          </h4>
          <address className="not-italic font-body text-xs text-[#5f5e5e] space-y-2">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#bc001f]" />
              <span>888 Ginza District, Tokyo, Japan</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#bc001f]" />
              <span>contact@nuri-sushi.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#bc001f]" />
              <span>+81 03-1234-5678</span>
            </p>
          </address>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#e7bcb9] text-[11px] font-mono text-[#5f5e5e]">
        <p>© 2026 NURI SUSHI. ALL RIGHTS RESERVED.</p>
        <p>DESIGNED FOR CULINARY PRECISION & VISUAL STUDIO C# INTEGRATION.</p>
      </div>
    </footer>
  );
};
