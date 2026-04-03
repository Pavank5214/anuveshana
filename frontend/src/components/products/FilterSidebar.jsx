import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, SortAsc, TrendingUp, DollarSign, ListFilter, ArrowUpDown, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/productsSlice";

const FilterSidebar = ({ isLight = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories: dynamicCategories } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    category: "",
    sortBy: "",
    minPrice: 0,
    maxPrice: 5000,
  });

  const sortOptions = [
    { value: "", label: "Suggested", icon: Sparkles },
    { value: "popularity", label: "Popularity", icon: TrendingUp },
    { value: "priceAsc", label: "Price: Low to High", icon: ArrowUpDown },
    { value: "priceDesc", label: "Price: High to Low", icon: ArrowUpDown },
  ];

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "All",
      sortBy: params.sortBy || "",
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 5000,
    });
  }, [searchParams]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.category && newFilters.category !== "All") {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }

    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy);
    } else {
      params.delete("sortBy");
    }

    if (newFilters.maxPrice < 5000) {
      params.set("maxPrice", newFilters.maxPrice);
    } else {
      params.delete("maxPrice");
    }

    // Reset page when filters change
    params.delete("page");

    setSearchParams(params);
  };

  const allCategories = ["All", ...dynamicCategories];

  return (
    <div className={`space-y-8 ${isLight ? "text-slate-800" : "text-white"}`}>
      {/* Categories */}
      <div>
        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${isLight ? "text-slate-400" : "text-white/30"}`}>
          <div className="w-1 h-2.5 bg-[#ff6200] rounded-full" />
          Categories
        </h4>
        <div className="space-y-0.5">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange("category", cat)}
              className={`w-full group flex items-center justify-between py-2 px-2.5 rounded-lg transition-all ${filters.category === cat
                  ? "bg-[#ff6200] text-white shadow-md shadow-[#ff6200]/10"
                  : `hover:bg-white/5 ${isLight ? "text-slate-600 hover:text-[#ff6200]" : "text-white/40 hover:text-white"}`
                }`}
            >
              <span className={`text-[13px] tracking-tight ${filters.category === cat ? "font-bold" : "font-medium"}`}>
                {cat}
              </span>
              {filters.category === cat && <Check size={12} className="opacity-70" />}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting Selection */}
      <div>
        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${isLight ? "text-slate-400" : "text-white/30"}`}>
          <div className="w-1 h-2.5 bg-[#ff6200] rounded-full" />
          Sort By
        </h4>
        <div className="space-y-0.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange("sortBy", opt.value)}
              className={`w-full group flex items-center justify-between py-2 px-2.5 rounded-lg transition-all ${filters.sortBy === opt.value
                  ? "bg-[#ff6200] text-white shadow-md shadow-[#ff6200]/10"
                  : `hover:bg-white/5 ${isLight ? "text-slate-600 hover:text-[#ff6200]" : "text-white/40 hover:text-white"}`
                }`}
            >
              <span className={`text-[13px] tracking-tight ${filters.sortBy === opt.value ? "font-bold" : "font-medium"}`}>
                {opt.label}
              </span>
              {filters.sortBy === opt.value && <opt.icon size={12} className="opacity-70" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isLight ? "text-slate-400" : "text-white/30"}`}>
            <div className="w-1 h-2.5 bg-[#ff6200] rounded-full" />
            Price Range
          </h4>
          <span className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${isLight ? "bg-white text-slate-800 border-slate-100" : "bg-white/[0.03] text-white border-white/10"}`}>
            ₹{filters.maxPrice}
          </span>
        </div>
        <div className="px-1">
          <input
            type="range"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            min={0}
            max={5000}
            step={50}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#ff6200] transition-all"
          />
          <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-white/10 mt-4 uppercase">
            <span>₹0</span>
            <div className="w-1 h-1 rounded-full bg-white/5" />
            <span>₹5000+</span>
          </div>
        </div>
      </div>

      {/* Utilities */}
      <div className={`pt-8 border-t ${isLight ? "border-slate-100" : "border-white/5"}`}>
        <button
          onClick={() => {
            setSearchParams(new URLSearchParams());
            setFilters({ category: "All", sortBy: "", minPrice: 0, maxPrice: 5000 });
          }}
          className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border ${isLight
              ? "bg-slate-50 text-slate-400 border-slate-200 hover:bg-[#ff6200]/5 hover:text-[#ff6200]"
              : "bg-white/[0.02] text-white/20 border-white/5 hover:bg-white/[0.04] hover:text-white"
            }`}
        >
          <Sparkles size={11} className="opacity-30" />
          Reset All
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
