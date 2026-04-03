import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { motion } from "framer-motion";
import {
  Package,
  ChevronRight,
  Clock,
  Check,
  AlertCircle,
  ShoppingBag
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
  })
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
    return new Date(date).toLocaleString("en-US", {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Mobile-optimized skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#06090F]  mt-5 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 w-40 bg-white/5 rounded-lg animate-pulse mb-6 sm:mb-8" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full bg-white/[0.02] border border-white/[0.04] rounded-[1.5rem] p-4 sm:p-6 animate-pulse">
              <div className="flex justify-between mb-4 pb-4 border-b border-white/[0.04]">
                <div className="h-4 w-24 bg-white/5 rounded-md" />
                <div className="h-6 w-20 bg-white/5 rounded-full" />
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-xl shrink-0" />
                <div className="space-y-3 flex-1">
                  <div className="h-5 w-3/4 bg-white/5 rounded-md" />
                  <div className="h-4 w-1/3 bg-white/5 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#06090F] flex items-center justify-center p-4 pt-24">
        <div className="bg-[#111620] border border-red-500/10 p-8 rounded-[2rem] text-center max-w-sm w-full">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
          <p className="text-white font-medium text-lg mb-2">Sync Error</p>
          <p className="text-slate-400 mb-6 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3.5 bg-white text-black hover:bg-slate-200 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090F] pt-24 mt-5 md:pt-32 pb-24 relative font-sans">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[80vw] sm:w-[500px] h-[500px] bg-[#ff6200]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            My <span className="text-[#ff6200]">Orders</span>
          </h1>
          <p className="text-slate-400 text-sm">Track your recent purchases and returns.</p>
        </motion.div>

        {orders?.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const firstItem = order.orderItems?.[0];
              const extraItemsCount = (order.orderItems?.length || 1) - 1;

              return (
                <motion.div
                  key={order._id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={idx + 1}
                  onClick={() => handleRowClick(order._id)}
                  className="group bg-[#111620]/80 backdrop-blur-md border border-white/[0.04] rounded-[1.5rem] p-4 sm:p-6 cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.08] active:scale-[0.98] transition-all duration-200 block"
                >
                  {/* Top Row: Meta & Status */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.04]">
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Order Id: #{order.orderId || order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm font-medium text-slate-300">{formatDate(order.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/support/order?orderId=${order._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                      >
                        Support
                      </Link>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${order.status === 'Delivered'
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : order.status === 'Cancelled'
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : order.status === 'Shipped' || order.status === 'Printing'
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-[#ff6200]/10 text-[#ff6200] border-[#ff6200]/20"
                        }`}>
                        {order.status === 'Delivered' ? <Check size={14} /> : order.status === 'Cancelled' ? <AlertCircle size={14} /> : <Clock size={14} />}
                        {order.status || (order.isDelivered ? "Delivered" : "Processing")}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Product Snippet */}
                  <div className="flex items-center gap-4 sm:gap-5">

                    {/* Image Thumbnail */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/5 border border-white/[0.05]">
                        <img
                          src={firstItem?.image}
                          alt={firstItem?.name || "Product"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {extraItemsCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#ff6200] border-2 border-[#111620] flex items-center justify-center text-[10px] font-bold text-white">
                          +{extraItemsCount}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-white truncate mb-1 group-hover:text-[#ff6200] transition-colors">
                        {firstItem?.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span className="text-slate-400 font-medium">
                          {order.orderItems?.length} {order.orderItems?.length === 1 ? 'Item' : 'Items'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
                        <span className="text-white font-semibold">
                          ₹{order.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Native App-Style Arrow */}
                    <div className="shrink-0 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                      <ChevronRight size={20} />
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Mobile-Optimized Empty State */
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className="bg-[#111620]/40 border border-white/[0.04] rounded-[2rem] p-8 sm:p-12 text-center mt-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={28} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
            <p className="text-slate-400 text-sm mb-8 max-w-[250px] mx-auto leading-relaxed">
              When you buy something, your order will show up here.
            </p>
            <Link
              to="/"
              className="flex items-center justify-center w-full sm:w-auto sm:inline-flex gap-2 px-8 py-3.5 bg-[#ff6200] active:bg-[#e65800] hover:bg-[#e65800] text-white font-semibold rounded-xl transition-all"
            >
              Start Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;