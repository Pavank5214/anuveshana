import React from "react";
import { useSearchParams } from "react-router-dom";
import { FaSort } from "react-icons/fa";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-6 flex items-center justify-end">
      <div className="relative inline-block">
        {/* Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <FaSort />
        </div>

        {/* Custom Select */}
        <select
          id="sort"
          onChange={handleSortChange}
          value={searchParams.get("sortBy") || ""}
          className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg 
                     text-gray-700 bg-white shadow-sm 
                     hover:border-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition duration-150 ease-in-out cursor-pointer"
        >
          <option value="">Sort by (Default)</option>
          <option value="priceAsc">💲 Price: Low → High</option>
          <option value="priceDesc">💲 Price: High → Low</option>
          <option value="popularity">⭐ Popularity</option>
        </select>

        {/* Dropdown Arrow */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          ▼
        </div>
      </div>
    </div>
  );
};

export default SortOptions;
