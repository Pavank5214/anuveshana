import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../redux/slices/portfolioSlice";
import { Layers, Car, Stethoscope, Factory } from "lucide-react";

const Portfolio = () => {
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector((state) => state.portfolio);

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchPortfolios());
  }, [dispatch]);

  const filterButtons = [
    { name: "All Projects", filter: "all", icon: <Layers size={16} /> },
    { name: "Automotive", filter: "automotive", icon: <Car size={16} /> },
    { name: "Medical", filter: "medical", icon: <Stethoscope size={16} /> },
    { name: "Industrial", filter: "industrial", icon: <Factory size={16} /> },
  ];

  const filteredItems =
    activeFilter === "all"
      ? portfolios
      : portfolios.filter((item) => item.category === activeFilter);

  // --- Dark Mode Skeleton Loader ---
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F19] py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="h-12 w-64 bg-slate-800 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-slate-800 rounded-lg mx-auto mb-12 animate-pulse" />
          
          <div className="flex justify-center gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="h-10 w-32 bg-slate-800 rounded-full animate-pulse" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900 rounded-2xl overflow-hidden h-96 animate-pulse border border-slate-800">
                <div className="h-56 bg-slate-800" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-slate-800 rounded" />
                  <div className="h-4 w-full bg-slate-800 rounded" />
                  <div className="h-4 w-1/2 bg-slate-800 rounded" />
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
      <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <p className="text-red-400 font-bold text-xl">Unable to load projects</p>
          <p className="text-red-300/60 mt-2">{error}</p>
        </div>
      </main>
    );

  return (
    <main className="mt-5 min-h-screen bg-[#0B0F19] text-white pt-28 pb-20 relative overflow-x-hidden selection:bg-orange-500/30">
      
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Masterpieces</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Explore a curated selection of high-precision components engineered for the most demanding industries.
          </motion.p>
        </div>

        {/* --- Filter Tabs --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterButtons.map((btn) => (
            <button
              key={btn.filter}
              onClick={() => setActiveFilter(btn.filter)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border ${
                activeFilter === btn.filter
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                  : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white backdrop-blur-md"
              }`}
            >
              {btn.icon}
              {btn.name}
            </button>
          ))}
        </div>

        {/* --- Portfolio Grid --- */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4">
                    <Layers size={32} className="text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium">No projects found in this category.</p>
              </motion.div>
            )}

            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-slate-950">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    // Minimalist Fallback - just a clean dark background
                    <div className="h-full w-full bg-gradient-to-br from-slate-900 to-slate-800" />
                  )}
                  
                  {/* Overlay Gradient (Always visible for text readability) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full backdrop-blur-md">
                        {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 relative">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
                    {item.description}
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