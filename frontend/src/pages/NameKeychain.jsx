import React, { useState, useMemo, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type,
  Palette,
  Sparkles,
  Layout,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";

/** 
 * 🎨 2D NAME PLATE STUDIO - HARMONIZED EDITION 🎨
 * UI components and layout shared with InitialNameStand.jsx for consistency.
 */

const ALLOWED_COLORS = [
  { name: 'Orange', hex: '#ff6200' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Grey', hex: '#737373' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0066cc' },
  { name: 'Green', hex: '#32CD32' },
  { name: 'Yellow', hex: '#FFDE21' },
  { name: 'Purple', hex: '#C986E3' },
  { name: 'Gold', hex: '#D3AF37' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Royal Blue', hex: '#02066F' },
  { name: 'Cyan Blue', hex: '#00FFFF' },
  { name: 'Light Green', hex: '#32CD32' },
  { name: 'Dark Green', hex: '#003314' },
  { name: 'Light Brown', hex: '#C89D7C' },
  { name: 'Dark Brown', hex: '#332421' },
  { name: 'Silver', hex: '#D9D9D9' },
];

const AVAILABLE_SIZES = ['S', 'M', 'L'];
const MAX_NAME_LENGTH = 15;

const NameKeychain = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const guestId = useSelector((state) => state.cart.guestId);

  const [name, setName] = useState("Anmol");
  const [baseColor, setBaseColor] = useState(ALLOWED_COLORS[1].hex); // White
  const [textColor, setTextColor] = useState(ALLOWED_COLORS[0].hex); // Orange
  const [selectedSize, setSelectedSize] = useState(AVAILABLE_SIZES[1]); // M

  const deferredName = useDeferredValue(name);


  const ColorStrip = ({ title, colors, selectedColor, onSelect }) => {
    const selectedName = colors.find(c => c.hex === selectedColor)?.name;

    return (
      <div className="space-y-2.5 lg:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-orange-500" />
            <h3 className="text-[11px] lg:text-xs font-bold text-white uppercase tracking-widest">{title}</h3>
          </div>
          <span className="text-[9px] lg:text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md">
            {selectedName || selectedColor}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5 lg:gap-3 pt-1">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => onSelect(c.hex)}
              aria-label={`Select ${c.name}`}
              className={`w-8 h-8 lg:w-[38px] lg:h-[38px] rounded-full border-2 transition-all shrink-0 hover:scale-110 focus:outline-none ${selectedColor === c.hex
                ? 'border-orange-500 scale-110 ring-2 ring-orange-500/80 ring-offset-2 ring-offset-[#111620] z-10'
                : 'border-slate-700/50 hover:border-slate-500'
                }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#06090F] pt-21 mt-5 lg:pt-24 font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* 🧩 Load Fonts 🧩 */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
                .font-pacifico { font-family: 'Pacifico', cursive; }
            `}</style>

      {/* Preview Area */}
      <div className="h-[45%] lg:h-auto lg:flex-[1.4] relative flex items-center justify-center p-4 lg:p-20 bg-[radial-gradient(circle_at_center,_#111827_0%,_#06090F_100%)] z-0 shrink-0">
        <div className="w-full h-full max-w-[320px] lg:max-w-[800px] flex items-center justify-center drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)] overflow-visible">
          <svg viewBox="0 0 1000 400" className="w-full h-full max-h-full overflow-visible">
            <defs>
              <filter id="organicBorder" x="-50%" y="-50%" width="200%" height="200%">
                <feMorphology operator="dilate" radius="20" in="SourceAlpha" result="dilated" />
                <feFlood floodColor={baseColor} result="floodColor" />
                <feComposite in="floodColor" in2="dilated" operator="in" result="silhouette" />
                <feGaussianBlur stdDeviation="0.8" result="softSilhouette" />
                <feMerge>
                  <feMergeNode in="softSilhouette" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-pacifico text-[160px]"
              filter="url(#organicBorder)"
              fill={textColor}
              style={{ letterSpacing: '2px', transition: 'fill 0.4s ease' }}
            >
              {deferredName || "Anmol"}
            </text>
          </svg>
        </div>

        {/* Info Labels */}
        <div className="absolute top-4 left-4 hidden sm:flex flex-col gap-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
            <Sparkles size={12} className="text-orange-500" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">SVG Organic Studio</span>
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <motion.div
        className="h-[55%] lg:h-auto w-full lg:w-[460px] bg-[#121721] lg:bg-[#111620]/95 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] lg:shadow-[-10px_-20px_40px_rgba(0,0,0,0.4)] rounded-t-3xl lg:rounded-t-none"
      >
        <div className="w-full flex justify-center pt-3 pb-1 lg:hidden shrink-0">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-10 pt-2 lg:pt-10 scrollbar-hide">
          <div className="max-w-md mx-auto space-y-6 lg:space-y-10 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 lg:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(255,98,0,0.15)]">
                  <Layout size={18} className="lg:w-5 lg:h-5" />
                </div>
                <h2 className="text-lg lg:text-2xl font-black text-white uppercase tracking-tighter italic">Personalize</h2>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type size={14} className="text-orange-500" />
                    <label className="text-[11px] lg:text-xs font-bold text-white uppercase tracking-widest" htmlFor="nameInput">Type Name</label>
                  </div>
                  <span className={`text-[10px] font-medium ${name.length >= MAX_NAME_LENGTH ? 'text-red-400' : 'text-slate-500'}`}>
                    {name.length}/{MAX_NAME_LENGTH}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="nameInput"
                    type="text"
                    value={name}
                    maxLength={MAX_NAME_LENGTH}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))}
                    className="w-full bg-[#06090F] border border-white/10 rounded-xl px-4 py-3.5 lg:py-4 text-xs lg:text-sm font-bold text-white uppercase tracking-widest focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-inner placeholder:text-slate-700"
                    placeholder="ENTER NAME..."
                  />
                </div>
              </div>

              {/* Color Selections - RESTORED */}
              <div className="space-y-8 px-1">
                <ColorStrip
                  title="Text Color"
                  colors={ALLOWED_COLORS}
                  selectedColor={textColor}
                  onSelect={setTextColor}
                />
                <ColorStrip
                  title="Base Color"
                  colors={ALLOWED_COLORS}
                  selectedColor={baseColor}
                  onSelect={setBaseColor}
                />
              </div>

            </div>

            <div className="pt-6 lg:pt-8 border-t border-white/5 space-y-2 lg:space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff6200]" />
                <p className="text-[9px] lg:text-[10px] text-slate-300 font-black uppercase tracking-widest text-center">
                  Actual product may differ slightly
                </p>
              </div>
              <p className="text-[10px] lg:text-xs text-slate-500 font-medium text-center leading-relaxed px-2 lg:px-4">
                The base plate follows the cursive curves of your name exactly for optimal visual flow.
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default NameKeychain;
