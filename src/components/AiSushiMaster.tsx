import React, { useState } from 'react';
import { Sparkles, Bot, Send, Flame, RefreshCw, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AiSushiMasterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSushiMaster: React.FC<AiSushiMasterProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [dietary, setDietary] = useState<string>('Raw Salmon & Spicy Tuna Lover');
  const [flavorProfile, setFlavorProfile] = useState<string>('Savory Umami with Truffle & Yuzu');
  const [sakePairing, setSakePairing] = useState<boolean>(true);
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateRecommendation = async () => {
    setLoading(true);
    setRecommendation('');

    try {
      // Use Gemini API if process.env.GEMINI_API_KEY is defined or fallback gracefully
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the Nuri Sushi Master Chef in Ginza, Tokyo. A customer asks for a personalized sushi recommendation.
Customer Preferences:
- Taste Profile: ${flavorProfile}
- Dietary Request: ${dietary}
- Include Sake Pairing: ${sakePairing ? 'Yes' : 'No'}

Give a concise, elegant, 3-bullet point Japanese culinary recommendation starting with a signature roll, a sashimi/nigiri pair, and a Kyoto sake pairing.`
        });
        setRecommendation(response.text || 'Recommendation generated.');
      } else {
        // High quality fallback recommendation
        setTimeout(() => {
          setRecommendation(`🍣 **NURI SUSHI MASTER RECOMMENDATION**

1. **Signature Roll:** Red Dragon Signature — Seared Ahi tuna with artisanal eel reduction and spicy serrano crunch.
2. **Nigiri & Sashimi Pair:** Truffle Wagyu Nigiri paired with Tsukiji Otoro Fatty Tuna Sashimi.
3. **Sake Pairing:** Dassai 23 Junmai Daiginjo served chilled at 8°C to balance the umami notes.`);
          setLoading(false);
        }, 1000);
        return;
      }
    } catch (e) {
      setRecommendation(`🍣 **NURI SUSHI MASTER RECOMMENDATION**

1. **Signature Roll:** Red Dragon Signature Roll (Seared spicy tuna, avocado, eel drizzle)
2. **Special Pair:** Tsukiji Fatty Tuna Sashimi & A5 Truffle Wagyu Nigiri
3. **Beverage Pairing:** Kyoto Dassai 23 Junmai Daiginjo`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#e7bcb9] max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#1a1c1c] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#bc001f]" />
            <div>
              <span className="font-mono-caps text-[10px] text-[#bc001f] font-bold">GEMINI AI INTEGRATION</span>
              <h3 className="font-display text-xl font-bold">Ginza AI Sushi Master</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-[#1a1c1c]">
          <p className="font-body text-xs text-[#5f5e5e]">
            Let our AI Master Sommelier craft your personalized Nuri Sushi tasting menu and sake pairing based on your precise flavor preferences.
          </p>

          <div>
            <label className="block font-mono-caps text-xs font-bold mb-1">
              Dietary & Seafood Preference
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full border border-gray-200 p-2.5 text-xs font-body focus:border-[#bc001f] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono-caps text-xs font-bold mb-1">
              Flavor Profile
            </label>
            <input
              type="text"
              value={flavorProfile}
              onChange={(e) => setFlavorProfile(e.target.value)}
              className="w-full border border-gray-200 p-2.5 text-xs font-body focus:border-[#bc001f] focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
            <input
              type="checkbox"
              checked={sakePairing}
              onChange={(e) => setSakePairing(e.target.checked)}
              className="accent-[#bc001f]"
            />
            <span>Include Sake & Craft Beverage Pairing</span>
          </label>

          <button
            onClick={handleGenerateRecommendation}
            disabled={loading}
            className="w-full bg-[#bc001f] text-white font-mono-caps text-xs py-3 hover:bg-[#e6192e] transition-all flex items-center justify-center gap-2 font-bold"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            <span>{loading ? 'CONSULTING AI SUSHI MASTER...' : 'CRAFT MY TASTING MENU'}</span>
          </button>

          {recommendation && (
            <div className="bg-[#f9f9f9] border border-[#e7bcb9] p-4 text-xs font-body whitespace-pre-line leading-relaxed text-[#1a1c1c] animate-fade-in">
              {recommendation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
