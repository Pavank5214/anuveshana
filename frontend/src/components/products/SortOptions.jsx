import React from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown } from "lucide-react"; // Using a more modern icon

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    if (sortBy) {
        searchParams.set("sortBy", sortBy);
    } else {
        searchParams.delete("sortBy");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-6 flex items-center justify-end">
      <div className="relative inline-block">
        {/* Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <ArrowUpDown size={16} />
        </div>

        {/* Custom Select with updated theme */}
        <select
          id="sort"
          onChange={handleSortChange}
          value={searchParams.get("sortBy") || ""}
          className="appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                     text-gray-700 bg-white shadow-sm 
                     hover:border-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-[#ff6200] focus:border-[#ff6200] 
                     transition duration-150 ease-in-out cursor-pointer"
        >
          <option value="">Sort by (Default)</option>
          <option value="priceAsc">💲 Price: Low → High</option>
          <option value="priceDesc">💲 Price: High → Low</option>
          <option value="popularity">⭐ Popularity</option>
        </select>

        {/* Dropdown Arrow Icon */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
           <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;