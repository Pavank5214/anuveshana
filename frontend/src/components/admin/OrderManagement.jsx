import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Truck,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  CreditCard,
  Layers,
  Smartphone
} from "lucide-react";

/**
 * Admin Order Management - High-Spec Enterprise Edition
 * Redesigned for professional precision, dark theme consistency, and logistical control.
 */
const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleUpdate = (orderId, updates) => {
    dispatch(updateOrderStatus({ id: orderId, ...updates }));
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (loading && orders.length === 0) return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Initialising Pipeline...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050608] pt-32 pb-24 text-slate-400 font-sans selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto px-6">

        {/* Workspace Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
              Order <span className="text-[#ff6200]">Management</span>
            </h1>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">System Administrator Interface v4.0.2</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search Order ID or User..."
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-orange-500/50 w-full md:w-80 transition-all placeholder:text-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <Filter size={14} className="text-slate-600" />
              <select
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer uppercase tracking-widest"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All" className="bg-[#0B0F19]">All Orders</option>
                <option value="Placed" className="bg-[#0B0F19]">Placed</option>
                <option value="Processing" className="bg-[#0B0F19]">Processing</option>
                <option value="Printing" className="bg-[#0B0F19]">Printing</option>
                <option value="Shipped" className="bg-[#0B0F19]">Shipped</option>
                <option value="Delivered" className="bg-[#0B0F19]">Delivered</option>
                <option value="Cancelled" className="bg-[#0B0F19]">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Pipeline List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  idx={idx}
                  isExpanded={expandedOrderId === order._id}
                  onToggle={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                  onUpdate={handleUpdate}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] py-24 text-center"
              >
                <Package size={48} className="text-slate-800 mx-auto mb-6" />
                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.3em]">No active orders matching criteria</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

const OrderCard = ({ order, idx, isExpanded, onToggle, onUpdate }) => {
  const [localStatus, setLocalStatus] = useState(order.status);
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [courier, setCourier] = useState(order.courier || "");

  const statusStyles = {
    Processing: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Shipped: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Cancelled: "text-red-400 bg-red-400/10 border-red-400/20"
  };

  const statusMap = {
    "Placed": 0,
    "Processing": 1,
    "Printing": 2,
    "Shipped": 3,
    "Delivered": 4,
    "Cancelled": -1
  };

  const activeStepIndex = statusMap[order.status] ?? 0;

  const steps = [
    { label: "Placed", icon: Package, completed: activeStepIndex >= 0 },
    { label: "Processing", icon: Clock, completed: activeStepIndex >= 1 },
    { label: "Printing", icon: Layers, completed: activeStepIndex >= 2 },
    { label: "Shipped", icon: Truck, completed: activeStepIndex >= 3 },
    { label: "Delivered", icon: CheckCircle2, completed: activeStepIndex >= 4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`bg-[#0A0B0E] border rounded-[2rem] overflow-hidden transition-all duration-500 shadow-2xl ${isExpanded ? 'border-orange-500/40 ring-1 ring-orange-500/10 shadow-orange-500/5' : 'border-white/5'}`}
    >
      {/* High-Level Overview Stripe */}
      <div
        onClick={onToggle}
        className="p-8 cursor-pointer group flex flex-wrap items-center justify-between gap-8 relative"
      >
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500">
            <Package size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">#{order._id.slice(-8)}</h2>
              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyles[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><User size={12} className="text-slate-700" /> {order.user?.name || 'Anonymous'}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-700" /> {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-1">Total Payload</p>
            <p className="text-xl font-bold text-white tracking-tighter">₹{order.totalPrice.toLocaleString()}</p>
          </div>
          <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-hover:bg-orange-500 group-hover:text-white transition-all ${isExpanded ? 'rotate-180 bg-orange-500 text-white' : ''}`}>
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/5 bg-white/[0.01]"
          >
            <div className="p-8 sm:p-12 space-y-16">

              {/* Internal Workspace: Logistic Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left: Global Tracking Stepper (Matches User View) */}
                <div className="lg:col-span-12 space-y-8">
                  <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Truck size={14} className="text-orange-500" />
                    Delivery Timeline Matrix
                  </h3>

                  <div className="flex justify-between items-center relative py-4">
                    {steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex flex-col items-center gap-3 relative z-10 w-full group">
                        <motion.div
                          animate={sIdx === activeStepIndex ? {
                            boxShadow: [
                              "0 0 0px rgba(255,98,0,0)",
                              "0 0 35px rgba(255,98,0,0.4)",
                              "0 0 0px rgba(255,98,0,0)"
                            ],
                            scale: [1, 1.1, 1],
                          } : {}}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${sIdx === activeStepIndex ? 'bg-orange-500 border-orange-500 text-white shadow-2xl shadow-orange-500/20' : (step.completed ? 'bg-white/5 border-orange-500/40 text-orange-500' : 'bg-[#0B0F19] border-white/10 text-slate-700')}`}
                        >
                          <step.icon size={20} />
                        </motion.div>
                        <motion.span
                          animate={sIdx === activeStepIndex ? { opacity: [0.4, 1, 0.4] } : {}}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                          className={`text-[9px] font-black uppercase tracking-widest ${sIdx <= activeStepIndex ? 'text-white' : 'text-slate-700'}`}
                        >
                          {step.label}
                        </motion.span>

                        {/* Static Connector */}
                        {sIdx < steps.length - 1 && (
                          <div className="absolute top-6 left-[60%] w-[80%] h-[2px] bg-white/5 -z-10 overflow-hidden rounded-full">
                            <div className={`h-full bg-orange-500/40 transition-all duration-1000 ${step.completed ? 'w-full' : 'w-0'}`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left Part: Data Panels */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shipping Destination */}
                  <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-orange-500" /> Destination
                    </h4>
                    {order.shippingAddress ? (
                      <div className="space-y-1.5">
                        <p className="text-lg font-bold text-white tracking-tight">{order.shippingAddress.address}</p>
                        <p className="text-sm text-slate-400 font-medium italic opacity-60">
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4">
                          <Smartphone size={14} className="text-slate-700" />
                          <span className="text-xs font-bold text-slate-500">+91 {order.shippingAddress.phone}</span>
                        </div>
                      </div>
                    ) : <p className="text-xs text-slate-700 italic">No Address Matrix</p>}
                  </div>

                  {/* Payment Matrix */}
                  <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard size={12} className="text-orange-500" /> Financials
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <p className="text-sm font-bold text-white tracking-tight uppercase">{order.isPaid ? 'Payment Captured' : 'Awaiting Settlement'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Method</p>
                        <p className="text-sm font-bold text-white uppercase">{order.paymentMethod || 'Razorpay Gateway'}</p>
                      </div>
                      {order.paymentDetails?.razorpay_payment_id && (
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[9px] font-bold text-slate-600 overflow-hidden text-ellipsis uppercase tracking-[0.1em]">TXN ID: <span className="text-white">{order.paymentDetails.razorpay_payment_id}</span></p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Manifest */}
                  <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Inventory Manifest</h4>
                    <div className="space-y-6">
                      {order.orderItems.map((item, idX) => (
                        <div key={idX} className="flex items-center justify-between gap-6 group/item">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 group-hover/item:border-orange-500/40 transition-all">
                              <img src={item.image} className="w-full h-full object-cover opacity-80" alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-tight mb-1">{item.name}</p>
                              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                <span>x{item.quantity} Unit</span>
                                <span className="w-1 h-1 rounded-full bg-slate-800" />
                                <span className="text-orange-500/80">{item.size || 'STD'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-slate-700 tracking-widest uppercase">Base ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Gross Total</p>
                        <p className="text-2xl font-black text-white tracking-tighter italic">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      <Link to={`/admin/order/${order._id}`} className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
                        Detailed Node View <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Part: Operational Controls */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="p-8 rounded-[2.5rem] bg-orange-500/5 border border-orange-500/10 space-y-10 group">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-3">
                      <ShieldCheck size={14} /> Control Panel
                    </h4>

                    <div className="space-y-8">
                      {/* Status Selector */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Update Lifecycle</label>
                        <select
                          className="w-full bg-[#050608] border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
                          value={localStatus}
                          onChange={(e) => setLocalStatus(e.target.value)}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Printing">Printing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Courier Service */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Logistics Courier</label>
                        <input
                          type="text"
                          placeholder="Delhivery / FedEx / DHL"
                          className="w-full bg-[#050608] border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-orange-500 placeholder:text-slate-800"
                          value={courier}
                          onChange={(e) => setCourier(e.target.value)}
                        />
                      </div>

                      {/* Tracking ID */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Tracking ID</label>
                        <input
                          type="text"
                          placeholder="AWB Number"
                          className="w-full bg-[#050608] border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-orange-500 placeholder:text-slate-800"
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                        />
                      </div>

                      {/* Shipping URL */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Track Order Link</label>
                        <input
                          type="text"
                          placeholder="https://tracker.service/..."
                          className="w-full bg-[#050608] border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-800"
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => onUpdate(order._id, { status: localStatus, trackingId, trackingUrl, courier })}
                      className="w-full py-5 rounded-[2rem] bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98]"
                    >
                      Commit Changes
                    </button>

                    <p className="text-[9px] text-center text-slate-700 italic font-medium uppercase tracking-widest">
                      Updates reflect instantly on customer manifest
                    </p>
                  </div>

                  {/* Quick Action Hub */}
                  <div className="flex items-center gap-4">
                    {order.trackingUrl && (
                      <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 p-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-orange-600/20 transition-all uppercase tracking-widest">
                        Track Order <ExternalLink size={14} />
                      </a>
                    )}
                    <button className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">
                      Print Manifest
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderManagement;
