import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";
import {
    Type,
    Palette,
    Sparkles,
    Layout,
    Box,
} from "lucide-react";

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

const InitialNameStand = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const guestId = useSelector((state) => state.cart.guestId);

    const [name, setName] = useState("Lucky");
    const [initialColor, setInitialColor] = useState(ALLOWED_COLORS[1].hex); // White
    const [nameColor, setNameColor] = useState(ALLOWED_COLORS[0].hex); // Orange
    const [selectedSize, setSelectedSize] = useState(AVAILABLE_SIZES[1]); // M


    const initialChar = useMemo(() => {
        const trimmed = name.trim();
        return trimmed ? trimmed.charAt(0).toUpperCase() : "A";
    }, [name]);

    const nameFontSize = useMemo(() => {
        const len = name.length;
        if (len > 10) return "50px";
        if (len > 7) return "65px";
        return "80px";
    }, [name]);

    const ColorStrip = ({ title, selectedColor, onSelect }) => {
        const selectedName = ALLOWED_COLORS.find(c => c.hex === selectedColor)?.name;

        return (
            <div className="space-y-2.5 lg:space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Palette size={14} className="text-orange-500" />
                        <h3 className="text-[11px] lg:text-xs font-bold text-white uppercase tracking-widest">{title}</h3>
                    </div>
                    <span className="text-[9px] lg:text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md">
                        {selectedName}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2.5 lg:gap-3 pt-1">
                    {ALLOWED_COLORS.map((c) => (
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
        // Using 100dvh prevents mobile browser URL bar jumps
        <div className="relative h-[100dvh] w-full bg-[#06090F] pt-21 mt-5 lg:pt-24 font-sans flex flex-col lg:flex-row overflow-hidden">

            {/* Preview Area: Locked to top 45% on mobile, full height on desktop */}
            <div className="h-[45%] lg:h-auto lg:flex-[1.4] relative flex items-center justify-center p-4 lg:p-20 bg-[radial-gradient(circle_at_center,_#111827_0%,_#06090F_100%)] z-0 shrink-0">

                <div className="w-full h-full max-w-[320px] lg:max-w-[500px] flex items-center justify-center drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]">
                    <svg viewBox="0 0 400 400" className="w-full h-full max-h-full overflow-visible">
                        <defs>
                            <filter id="dropshadow" height="130%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                                <feOffset dx="2" dy="2" result="offsetblur" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.6" />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <text
                            x="200"
                            y="320"
                            textAnchor="middle"
                            style={{
                                fontSize: "340px",
                                fontWeight: "530",
                                fill: initialColor,
                                fontFamily: "serif",
                                transition: "fill 0.4s ease"
                            }}
                            filter="url(#dropshadow)"
                        >
                            {initialChar}
                        </text>

                        <text
                            x="200"
                            y="218"
                            textAnchor="middle"
                            style={{
                                fontSize: nameFontSize,
                                fill: nameColor,
                                fontFamily: "'Lovely Melody', sans-serif",
                                textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                                transition: "fill 0.4s ease, font-size 0.3s ease"
                            }}
                        >
                            {name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "Preview"}
                        </text>
                    </svg>
                </div>

                {/* Info Labels - Hidden on small mobile to save space for preview */}
                <div className="absolute top-4 left-4 hidden sm:flex flex-col gap-2">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                        <Sparkles size={12} className="text-orange-500" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Custom Artist Stand</span>
                    </div>
                </div>
            </div>

            {/* Controls Area: Bottom 55% with scroll on mobile, side panel on desktop */}
            <motion.div
                className="h-[55%] lg:h-auto w-full lg:w-[460px] bg-[#121721] lg:bg-[#111620]/95 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] lg:shadow-[-10px_-20px_40px_rgba(0,0,0,0.4)] rounded-t-3xl lg:rounded-t-none"
            >
                {/* Mobile Drawer Handle Indicator */}
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
                            {/* Name Input */}
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
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#06090F] border border-white/10 rounded-xl px-4 py-3.5 lg:py-4 text-xs lg:text-sm font-bold text-white uppercase tracking-widest focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-inner placeholder:text-slate-700"
                                        placeholder="ENTER NAME..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-8 px-1">
                                <ColorStrip
                                    title="Initial Color"
                                    selectedColor={initialColor}
                                    onSelect={setInitialColor}
                                />
                                <ColorStrip
                                    title="Name Color"
                                    selectedColor={nameColor}
                                    onSelect={setNameColor}
                                />
                            </div>
                        </div>

                        {/* Disclaimer Footer */}
                        <div className="pt-6 lg:pt-8 border-t border-white/5 space-y-2 lg:space-y-3">
                            <div className="flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff6200]" />
                                <p className="text-[9px] lg:text-[10px] text-slate-300 font-black uppercase tracking-widest text-center">
                                    Actual product may differ slightly
                                </p>
                            </div>
                            <p className="text-[10px] lg:text-xs text-slate-500 font-medium text-center leading-relaxed px-2 lg:px-4">
                                Minor color variations may occur during hand-crafting for optimal stability.
                            </p>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default InitialNameStand;