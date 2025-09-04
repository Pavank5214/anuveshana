import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red", "Blue", "Black", "Green", "Yellow", "Gray",
    "White", "Pink", "Beige", "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Whool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashionista", "ChicStyle"];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    updateUrlParams(newFilters);
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto rounded-2xl shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Filters</h3>

      {/* Category */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Category</h4>
        {categories.map((category) => (
          <label key={category} className="flex items-center mb-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-400 rounded-full"
            />
            <span className="ml-2 text-gray-700">{category}</span>
          </label>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Gender</h4>
        {genders.map((gender) => (
          <label key={gender} className="flex items-center mb-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-400 rounded-full"
            />
            <span className="ml-2 text-gray-700">{gender}</span>
          </label>
        ))}
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Colors</h4>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border-2 transition hover:scale-110 ${filters.color === color ? "ring-2 ring-offset-2 ring-blue-500" : "border-gray-300"}`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Sizes</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleFilterChange}
                checked={filters.size.includes(size)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
              />
              <span className="ml-2 text-gray-700">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Material</h4>
        {materials.map((material) => (
          <label key={material} className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <span className="ml-2 text-gray-700">{material}</span>
          </label>
        ))}
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Brands</h4>
        {brands.map((brand) => (
          <label key={brand} className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <span className="ml-2 text-gray-700">{brand}</span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-lg font-medium text-gray-700 mb-3">Price Range</h4>
        <input
          type="range"
          name="priceRange"
          value={priceRange[1]}
          onChange={handlePriceChange}
          min={0}
          max={100}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-gray-700 text-sm mt-2">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
