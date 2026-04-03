import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminProducts, deleteProduct } from "../../redux/slices/adminProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  Eye,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Box,
  Layers,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

// Stat card component (consistent with AdminHomePage/UserManagement)
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay}>
    <div className="relative overflow-hidden bg-[#121620] border border-white/[0.06] rounded-2xl p-4 sm:p-5 group hover:border-white/10 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 ${color}`} />
      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <div className={`p-2 sm:p-2.5 rounded-xl ${color} bg-opacity-10 border border-white/[0.06]`}>
          <Icon size={18} className="text-white sm:w-5 sm:h-5 " />
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-0.5">{label}</p>
          <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProductManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector((state) => state.adminProducts);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Product deleted successfully");
        } else {
          toast.error("Failed to delete product");
        }
      });
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProductsCount = products.length;
  const totalCategories = [...new Set(products.map(p => p.category))].length;
  // Compute recent additions in last 7 days as an example stat
  const recentCount = products.filter(p => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(p.createdAt) > sevenDaysAgo;
  }).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="text-orange-500" size={24} />
            Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage inventory and catalog items</p>
        </motion.div>

        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/admin/products/create")}
          className="bg-[#ff6200] hover:bg-[#e55a00] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all border border-orange-500/20"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-8">
        <StatCard icon={Box} label="Total Catalog" value={totalProductsCount} color="bg-blue-500" delay={1} />
        <StatCard icon={Layers} label="Categories" value={totalCategories} color="bg-purple-500" delay={2} />
        <div className="col-span-2 lg:col-span-1">
          <StatCard icon={TrendingUp} label="Last 7 Days" value={`+${recentCount}`} color="bg-emerald-500" delay={3} />
        </div>
      </div>

      {/* Main Listing Container */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
        <div className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
          {/* List Header/Toolbar */}
          <div className="px-4 sm:px-6 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Box size={14} className="text-orange-500" />
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Inventory List</h2>
            </div>

            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
          </div>

          {loading && !products.length ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin text-orange-500 mx-auto mb-4" size={32} />
              <p className="text-slate-500 text-sm italic">Loading catalog...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center bg-red-500/5">
              <AlertCircle size={32} className="text-red-500/40 mx-auto mb-4" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.01]">
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-600">Product Item</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-600">Price</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-600">Category / SKU</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-14 rounded-lg overflow-hidden border border-white/10 bg-[#0B0F19] shrink-0">
                              {p.images?.length > 0 ? (
                                <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700 bg-white/5"><ImageIcon size={14} /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-slate-600 font-medium">#{p._id.slice(-6).toUpperCase()}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-white">₹{p.price?.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{p.category}</span>
                            <p className="text-[10px] text-slate-600 font-mono tracking-tight">{p.sku}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/products/${p._id}/edit`} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                              <Edit2 size={16} />
                            </Link>
                            <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden divide-y divide-white/[0.04]">
                {filteredProducts.map((p) => (
                  <div key={p._id} className="p-4 flex gap-4 transition-colors">
                    <div className="w-16 h-20 rounded-xl overflow-hidden border border-white/10 bg-[#0B0F19] shrink-0">
                      {p.images?.length > 0 ? (
                        <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-800"><ImageIcon size={18} /></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-bold text-white leading-tight truncate">{p.name}</h3>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Link to={`/admin/products/${p._id}/edit`} className="p-1.5 text-slate-500 hover:text-emerald-400 active:bg-white/10 rounded-lg">
                              <Edit2 size={14} />
                            </Link>
                            <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-500 hover:text-red-500 active:bg-white/10 rounded-lg">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-500 uppercase tracking-widest">{p.category}</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-black text-slate-600 font-mono tracking-tighter">SKU: {p.sku}</span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-auto">
                        <span className="text-[10px] text-slate-600 font-mono italic">#{p._id.slice(-6).toUpperCase()}</span>
                        <span className="text-sm font-black text-white">₹{p.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={28} className="text-slate-700" />
              </div>
              <h3 className="text-white font-bold mb-1">No products found</h3>
              <p className="text-slate-600 text-xs">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Footer support text */}
      <div className="mt-8 flex items-center justify-center gap-2 mb-4">
        <Layers size={12} className="text-slate-700" />
        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Global Product Registry • Anuveshana Admin</p>
      </div>
    </div>
  );
};

export default ProductManagement;
