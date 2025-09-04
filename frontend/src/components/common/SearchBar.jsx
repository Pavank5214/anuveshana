import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFilters,
  fetchProductsByFilters,
} from "../../redux/slices/productsSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return; // prevent empty search
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ease-in-out  ${
        isOpen
          ? "fixed top-0 left-0 w-full bg-white shadow-lg z-50 h-20 px-4 mt-10"
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full max-w-2xl"
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="bg-gray-100 px-5 py-3 pl-4 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800 w-full text-gray-800 placeholder-gray-500 text-sm sm:text-base transition"
          />

          {/* Search Icon */}
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
          >
            <HiMagnifyingGlass className="h-6 w-6" />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute -right-12 sm:-right-16 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-red-600 transition"
          >
            <HiMiniXMark className="h-7 w-7" />
          </button>
        </form>
      ) : (
        // Search Icon Button
        <button
          onClick={handleSearchToggle}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Open Search"
        >
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
