import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../redux/slices/portfolioSlice";

const Portfolio = () => {
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector((state) => state.portfolio);

  const [activeFilter, setActiveFilter] = useState("all");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch portfolios
  useEffect(() => {
    dispatch(fetchPortfolios());
  }, [dispatch]);

  // Filter buttons
  const filterButtons = [
    { name: "All", filter: "all" },
    { name: "Automotive", filter: "automotive" },
    { name: "Medical", filter: "medical" },
    { name: "Industrial", filter: "industrial" },
  ];

  const filteredItems =
    activeFilter === "all"
      ? portfolios
      : portfolios.filter((item) => item.category === activeFilter);

  // Conditional render after hooks
  if (loading) {
    return (
      <main className="py-30 bg-gray-200 mt-10 min-h-screen animate-pulse">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 w-3/4 bg-gray-300 rounded mx-auto mb-4" /> {/* Title */}
          <div className="h-6 w-1/2 bg-gray-300 rounded mx-auto mb-8" /> {/* Subtitle */}
  
          {/* Filter Buttons Skeleton */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="h-8 w-24 bg-gray-300 rounded-full" />
            ))}
          </div>
  
          {/* Portfolio Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Image Skeleton */}
                <div className="h-48 bg-gray-300" />
                {/* Info Skeleton */}
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-300 rounded" /> {/* Name */}
                  <div className="h-4 w-full bg-gray-300 rounded" /> {/* Description line 1 */}
                  <div className="h-4 w-5/6 bg-gray-300 rounded" /> {/* Description line 2 */}
                  <div className="h-3 w-1/2 bg-gray-300 rounded mt-1" /> {/* Category */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Error: {error}
      </p>
    );


    

  return (
    <main className="py-30 bg-gray-200 mt-10 min-h-screen">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-gray-600 mb-8">
          Explore examples of our high-quality 3D printed parts for various
          industries.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterButtons.map((btn) => (
            <button
              key={btn.filter}
              onClick={() => setActiveFilter(btn.filter)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                activeFilter === btn.filter
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {btn.name}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.length === 0 && (
              <p className="col-span-full text-gray-500">No items found</p>
            )}
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Portfolio Image */}
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </div>

                {/* Portfolio Info */}
                <div className="p-4 text-left">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Category: {item.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
};

export default Portfolio;
