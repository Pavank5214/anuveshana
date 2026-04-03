import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { value: "", label: "Default Sorting" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "popularity", label: "Most Popular" },
];

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentSort = searchParams.get("sortBy") || "";
  const selectedOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("sortBy", value);
    } else {
      newParams.delete("sortBy");
    }
    newParams.delete("page"); // Reset To Page 1
    setSearchParams(newParams);
    setIsOpen(false);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-medium backdrop-blur-md transition-colors hover:bg-white/10 hover:border-white/20 min-w-[200px] justify-between group"
      >
        <span className="text-sm uppercase tracking-wider text-slate-300">Sort By:</span>
        <span className="text-[#ff6200]">{selectedOption.label}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-full min-w-[220px] bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-5 py-3 text-sm transition-colors hover:bg-white/5 flex items-center justify-between
                  ${currentSort === option.value ? 'text-[#ff6200] font-medium' : 'text-slate-300'}
                `}
              >
                {option.label}
                {currentSort === option.value && (
                  <motion.div layoutId="activeSort" className="w-1.5 h-1.5 rounded-full bg-[#ff6200]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortOptions;