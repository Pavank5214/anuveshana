import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { motion } from "framer-motion";
import { 
  Package, 
  Calendar, 
  ChevronRight, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const MyOrdersPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-10 w-48 bg-slate-800 rounded-xl" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 w-full bg-slate-800/50 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md backdrop-blur-xl">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-white font-bold text-xl mb-2">Oops! Something went wrong</p>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-28 pb-20 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#ff6200]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            My <span className="text-orange-500">Orders</span>
          </h1>
          <p className="text-slate-400 text-sm">Track and manage your recent purchases.</p>
        </motion.div>

        {orders?.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                variants={fadeUp}
                custom={idx + 1}
                onClick={() => handleRowClick(order._id)}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-5 cursor-pointer hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 group"
              >
                {/* Product Image (First item) */}
                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white/5 relative hidden sm:block">
                  <img
                    src={order.orderItems[0]?.image}
                    alt={order.orderItems[0]?.name || "Order item"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Main Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between sm:justify-start gap-3 mb-1">
                    <p className="font-bold text-white text-base">Order #{order._id?.slice(-8).toUpperCase()}</p>
                    <span className="text-xs text-slate-400 sm:hidden block">{formatDate(order.createdAt)}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="hidden sm:flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                    <span>{order.orderItems?.length} {order.orderItems?.length === 1 ? 'item' : 'items'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="font-semibold text-white">₹{order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Status Badges Section */}
                <div className="flex flex-row sm:flex-col gap-2 sm:items-end sm:w-40 shrink-0 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                  
                  {/* Delivery / Fulfillment Status */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    order.isDelivered 
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}>
                    {order.isDelivered ? <Truck size={12} /> : <Clock size={12} />}
                    {order.isDelivered ? "Delivered" : order.status || "Processing"}
                  </div>

                  {/* Payment Status */}
                  <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    order.isPaid ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {order.isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {order.isPaid ? "Paid" : "Payment Pending"}
                  </div>

                </div>

                {/* Chevron Arrow (Desktop only) */}
                <div className="hidden sm:flex items-center justify-center pl-2 shrink-0 text-slate-600 group-hover:text-orange-400 transition-colors">
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center"
          >
            <div className="inline-flex p-5 rounded-full bg-white/5 mb-4">
              <Package size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm">
              You haven't placed any orders with us yet. Start exploring our collection!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Start Shopping
              <ChevronRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;