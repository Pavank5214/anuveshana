import React from "react";
import { Type, Palette, Maximize2 } from "lucide-react";

const DynamicPersonalization = ({ fields, values, onChange, showErrors }) => {
    if (!fields || fields.length === 0) return null;

    const errBorder = (invalid) =>
        invalid ? "border-red-500/70 ring-1 ring-red-500/40" : "border-white/10";
    const errLabel = (invalid) =>
        invalid ? "text-red-400" : "text-slate-400";

    return (
        <div className="space-y-6">
            {fields.map((field, index) => {
                const value = values[field.label] || "";
                const isInvalid = showErrors && field.required && !value;

                return (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={`block text-[10px] font-bold uppercase tracking-widest transition-colors ${errLabel(isInvalid)}`}>
                                {isInvalid ? `⚠ Select ${field.label}` : field.label}
                            </label>
                            {field.type === 'size' && field.sizeGuideUrl && (
                                <a
                                    href={field.sizeGuideUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors font-medium underline underline-offset-2"
                                >
                                    Size Guide
                                </a>
                            )}
                        </div>

                        {field.type === 'text' && (
                            <div className="relative group">
                                <Type size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                                <input
                                    type="text"
                                    value={value}
                                    maxLength={field.maxLength}
                                    onChange={(e) => onChange(field.label, e.target.value)}
                                    placeholder={field.placeholder || "Enter details..."}
                                    className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3.5 text-xs font-bold text-white tracking-widest outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all ${errBorder(isInvalid)}`}
                                />
                                {field.maxLength && (
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 font-bold">
                                        {value.length}/{field.maxLength}
                                    </span>
                                )}
                            </div>
                        )}

                        {field.type === 'color' && (
                            <div className={`flex flex-wrap gap-2.5 p-2 rounded-xl border transition-all ${isInvalid ? "border-red-500/50 bg-red-500/5" : "border-white/5"}`}>
                                {field.options?.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => onChange(field.label, color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${value === color
                                            ? "border-orange-500 ring-2 ring-orange-500/40 ring-offset-2 ring-offset-[#0B0F19] scale-110"
                                            : "border-white/20 hover:scale-105 hover:border-white/40"
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        )}

                        {field.type === 'size' && (
                            <div className={`flex flex-wrap gap-2 p-2 rounded-xl border transition-all ${isInvalid ? "border-red-500/50 bg-red-500/5" : "border-white/5"}`}>
                                {field.options?.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => onChange(field.label, size)}
                                        className={`min-w-[3.5rem] px-4 py-2.5 rounded-lg text-xs font-black transition-all duration-300 border uppercase tracking-widest ${value === size
                                            ? "bg-[#ff6200] text-white border-[#ff6200] shadow-lg shadow-orange-500/25"
                                            : "bg-white/5 text-slate-300 border-white/10 hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicPersonalization;
