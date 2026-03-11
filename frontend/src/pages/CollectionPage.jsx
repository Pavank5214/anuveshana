import React, { useEffect, useState, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from "../components/products/FilterSidebar";
import SortOptions from "../components/products/SortOptions";
import ProductGrid from "../components/products/ProductGrid";
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import { motion } from "framer-motion";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleClickOutside = (e) => {
    //close sidebar if clicked
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,_rgba(255,98,0,0.15),_transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0" />

      <div className="flex-grow relative z-10 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-12 pt-24 pb-12">


        {/* Controls - Filter & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 mt-10 gap-4 sm:gap-6 border-b border-white/5 pb-6"
        >
          {/* <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-white tracking-wide">
              {products?.length > 0 ? products.length : 0} Products
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6200]" />
            <span className="text-sm text-slate-500 uppercase tracking-widest">Shown</span>
          </div> */}

          {/* Custom Sort Options */}
          <SortOptions />
        </motion.div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default CollectionPage