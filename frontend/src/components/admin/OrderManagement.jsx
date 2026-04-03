import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from '../../redux/slices/adminOrderSlice';
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  User,
  Truck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Box,
  Loader2,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Zap,
  MessageSquare,
  Mail
} from "lucide-react";

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

const StatusBadge = ({ status }) => {
  const styles = {
    Placed: "bg-blue-500/10 text-blue-400 border-blue-500/10",
    Processing: "bg-orange-500/10 text-orange-400 border-orange-500/10",
    Printing: "bg-purple-500/10 text-purple-400 border-purple-500/10",
    Shipped: "bg-blue-400/10 text-blue-400 border-blue-400/10",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
    Cancelled: "bg-red-500/10 text-red-500 border-red-500/10",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border shrink-0 ${styles[status] || "bg-white/5 text-slate-400"}`}>
      {status}
    </span>
  );
};

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { orders = [], totalSales, totalOrders, loading, error } = useSelector((state) => state.adminOrders);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, currentUser, navigate]);

  const filteredOrders = orders?.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  const pendingCount = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8 text-left">
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/[0.02] blur-[150px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
            <Package className="text-orange-500" size={24} />
            Order Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest opacity-60 font-mono">View and update customer orders</p>
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2"
        >
          <Filter size={14} className="text-slate-600" />
          <select
            className="bg-transparent text-[10px] font-black text-white focus:outline-none cursor-pointer uppercase tracking-widest outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All" className="bg-[#121620]">All Status</option>
            <option value="Placed" className="bg-[#121620]">Placed</option>
            <option value="Processing" className="bg-[#121620]">Processing</option>
            <option value="Printing" className="bg-[#121620]">Printing</option>
            <option value="Shipped" className="bg-[#121620]">Shipped</option>
            <option value="Delivered" className="bg-[#121620]">Delivered</option>
            <option value="Cancelled" className="bg-[#121620]">Cancelled</option>
          </select>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Sales" value={`₹${(totalSales || 0).toLocaleString()}`} color="bg-emerald-500" delay={1} />
        <StatCard icon={Box} label="Total Orders" value={totalOrders || 0} color="bg-blue-500" delay={2} />
        <div className="col-span-2 lg:col-span-1">
          <StatCard icon={Clock} label="Pending Orders" value={pendingCount} color="bg-orange-500" delay={3} />
        </div>
      </div>

      {/* Main Listing Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-orange-500" />
            <h2 className="text-[10px] font-bold text-white uppercase tracking-widest">Orders List</h2>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] text-white placeholder:text-slate-800 outline-none focus:border-orange-500/40 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && !orders.length ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin text-orange-500 mx-auto mb-4" size={28} />
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Loading Orders...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-red-500/5">
            <AlertCircle size={32} className="text-red-500/30 mx-auto mb-4" />
            <p className="text-red-400 text-xs font-medium">{error}</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <>
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/[0.04]">
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">Total Price</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="group hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0B0F19] border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-orange-500 transition-colors">
                            <Package size={14} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white tracking-widest group-hover:text-orange-400 transition-colors uppercase">#{order.orderId || order._id.slice(-8)}</span>
                            {order.isNew && (
                              <span className="flex items-center gap-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-lg shadow-red-600/20">
                                <Zap size={8} className="fill-white" /> NEW
                              </span>
                            )}
                            {order.ticketCount > 0 && (
                              <span className="flex items-center gap-1 bg-orange-600/10 border border-orange-500/20 text-orange-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse shadow-lg shadow-orange-500/10">
                                <MessageSquare size={8} /> {order.ticketCount} TICKETS
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {order.user?.name ? order.user.name.charAt(0) : 'G'}
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">{order.user?.name || 'Guest User'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-black text-white italic tracking-tight font-mono">₹{order.totalPrice.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight size={14} className="text-slate-800 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card List */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="p-5 active:bg-white/5 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#0B0F19] border border-white/5 flex items-center justify-center text-slate-700 shrink-0">
                      <Package size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xs font-black text-white tracking-widest truncate uppercase">#{order.orderId || order._id.slice(-8)}</h3>
                        {order.isNew && (
                          <span className="bg-red-600 text-white text-[7px] font-black px-1 rounded uppercase tracking-tighter">NEW</span>
                        )}
                        {order.ticketCount > 0 && (
                          <span className="bg-orange-600/10 border border-orange-500/20 text-orange-500 text-[7px] font-black px-1 rounded uppercase tracking-tighter">
                            <MessageSquare size={8} className="inline mr-0.5" /> {order.ticketCount}
                          </span>
                        )}
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>{order.user?.name || 'Guest'}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-slate-800" />
                        <span>₹{order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-800 shrink-0" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-16 text-center">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={22} className="text-slate-800" />
            </div>
            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-1">No orders found</h3>
            <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Try a different search</p>
          </div>
        )}
      </motion.div>

      {/* Footer Info */}
      <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
        <div className="flex items-center gap-1.5 text-slate-700">
          <ShieldCheck size={10} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Data</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <Box size={10} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Safe Updates</span>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
