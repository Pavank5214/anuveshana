import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPortfolios, deletePortfolio } from "../../redux/slices/portfolioSlice";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Layout,
  TrendingUp,
  Box,
  ChevronRight,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: "easeOut" },
  }),
};

// Simple Stat Card
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay}>
    <div className="relative overflow-hidden bg-[#121620] border border-white/[0.06] rounded-2xl p-4 group hover:border-white/10 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 ${color}`} />
      <div className="relative z-10 flex items-center gap-4">
        <div className={`p-2 rounded-xl ${color} bg-opacity-10 border border-white/[0.06]`}>
          <Icon size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-xl font-black text-white tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const PortfolioManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { portfolios = [], loading, error } = useSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolios());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deletePortfolio(id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Item deleted");
        } else {
          toast.error("Delete failed");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8 text-left">
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.02] blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Layout className="text-blue-500" size={24} />
            Portfolio Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest opacity-60">Manage your work showcase</p>
        </motion.div>

        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          onClick={() => navigate("/admin/portfolio/create")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/10 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={16} /> Add New Work
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard icon={Box} label="Total Items" value={portfolios.length} color="bg-blue-500" delay={1} />
        <StatCard icon={Layers} label="Categories" value={[...new Set(portfolios.map(p => p.category))].length} color="bg-purple-500" delay={2} />
        <div className="col-span-2 lg:col-span-1">
          <StatCard icon={TrendingUp} label="Live Online" value={portfolios.length} color="bg-emerald-500" delay={3} />
        </div>
      </div>

      {/* Portfolio List List */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] flex items-center gap-2">
          <ImageIcon size={14} className="text-blue-500" />
          <h2 className="text-[10px] font-bold text-white uppercase tracking-widest">Items List</h2>
        </div>

        {loading && !portfolios.length ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={28} />
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Loading List...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-red-500/5">
            <AlertCircle size={32} className="text-red-500/30 mx-auto mb-4" />
            <p className="text-red-400 text-xs font-medium">{error}</p>
          </div>
        ) : portfolios.length > 0 ? (
          <>
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/[0.04]">
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Photo</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Info</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {portfolios.map((item) => (
                    <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-lg bg-[#0B0F19] border border-white/10 overflow-hidden shadow-lg group-hover:border-blue-500/30 transition-colors">
                          <img src={item.images[0]} className="w-full h-full object-cover opacity-80" alt="" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-white tracking-widest group-hover:text-blue-400 transition-colors uppercase">{item.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-medium text-slate-600 truncate max-w-[200px]">"{item.description}"</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/portfolio/${item._id}/edit`)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-yellow-600 transition-all font-bold"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-red-600 transition-all font-bold"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card List */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {portfolios.map((item) => (
                <div key={item._id} className="p-5 flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded-xl bg-[#0B0F19] border border-white/5 overflow-hidden shrink-0">
                      <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black text-white tracking-widest truncate uppercase mb-1">{item.name}</h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <p className="text-[9px] text-slate-600 italic truncate flex-1">"{item.description}"</p>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/portfolio/${item._id}/edit`)} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-500 active:bg-yellow-600 active:text-white"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-500 active:bg-red-600 active:text-white"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-16 text-center">
            <Box size={28} className="text-slate-800 mx-auto mb-4" />
            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-1">Portfolio Is Empty</h3>
            <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Add your first work project</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PortfolioManagement;
