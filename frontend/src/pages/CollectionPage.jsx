import React, { useEffect, useState } from "react";
import { X, SlidersHorizontal, Filter } from "lucide-react";
import FilterSidebar from "../components/products/FilterSidebar";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/common/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import { motion, AnimatePresence } from "framer-motion";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error, totalPages, currentPage } = useSelector(
    (state) => state.products
  );

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#06090F] text-white flex flex-col pt-20 overflow-x-hidden selection:bg-[#ff6200]/30 selection:text-white">
      {/* Background Subtle Gradient */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,_rgba(255,98,0,0.06),_transparent_60%)] pointer-events-none z-0" />

      <div className="flex flex-col lg:flex-row flex-grow relative z-10 transition-all duration-700">

        {/* Desktop Left Sidebar - COMPRESSED (w-72) */}
        <aside className="hidden lg:block w-72 mt-9 shrink-0 bg-[#111620]/95 backdrop-blur-3xl border-r border-white/10 sticky top-20 h-[calc(100vh-80px)] z-40 overflow-y-auto scrollbar-hide shadow-[-10px_0_40px_rgba(0,0,0,0.5)]">
          <div className="p-6 xl:p-8">
            <div className="flex items-center gap-3 mb-8 pb-5 border-b border-white/5">
              <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                <Filter size={14} className="text-[#ff6200]" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight text-white/90">Filter</h3>
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest leading-none">Options</p>
              </div>
            </div>
            <FilterSidebar isLight={false} />
          </div>
        </aside>

        {/* Main Product Section - Shifted by ml-72 */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col pt-8 lg:pt-12">

          {/* Mobile Header with Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h1 className="text-xl font-bold tracking-tight capitalize">
              {collection === "all" ? "Explore Shop" : collection}
            </h1>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#111620] border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              <SlidersHorizontal size={12} /> Filter
            </button>
          </div>

          {/* Active Filters Bar */}
          <AnimatePresence>
            {Object.keys(queryParams).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2.5 mb-8 p-4 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-2 flex items-center gap-2">
                  Active:
                </span>
                {Object.entries(queryParams).map(([key, value]) => (
                  key !== 'page' && (
                    <motion.span
                      key={key}
                      layout
                      className="px-3 py-1 bg-white/[0.05] border border-white/10 text-white text-[10px] font-bold uppercase rounded-lg flex items-center gap-2 transition-all hover:border-[#ff6200]/30"
                    >
                      <span className="text-slate-500 font-medium">{key}:</span> {value}
                      <button
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete(key);
                          setSearchParams(newParams);
                        }}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </motion.span>
                  )
                ))}
                <button
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="text-[10px] font-bold uppercase text-[#ff6200] hover:text-white transition-all ml-2"
                >
                  Clear All
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid View */}
          <div className="flex-grow">
            <ProductGrid products={products} loading={loading} error={error} />

            {/* Pagination Controls */}
            {!loading && products.length > 0 && (
              <div className="mt-12 border-t border-white/5 pt-10 pb-20 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center rounded-[3rem] border border-white/10 bg-white/[0.01]">
                <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-8 border border-white/5">
                  <X size={32} className="text-slate-800" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No products found</h3>
                <p className="text-slate-500 text-[10px] max-w-xs mb-8">
                  Try different search criteria.
                </p>
                <button
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="px-10 py-3.5 bg-[#ff6200] text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-white hover:text-black transition-all"
                >
                  Reset Shop
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[90] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[80vw] max-w-sm bg-[#111620] border-r border-white/10 z-[100] lg:hidden p-8 overflow-y-auto scrollbar-hide shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10 pb-5 border-b border-white/5">
                <h3 className="text-lg font-bold text-white tracking-tight">Filter Options</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <FilterSidebar isLight={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionPage;