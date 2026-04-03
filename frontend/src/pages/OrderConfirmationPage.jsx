import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  ShoppingBag,
  MapPin,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

const checkPop = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

const OrderConfirmationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (!checkout) return null;

  // Finalized orders use 'orderItems', initial sessions use 'checkoutItems'
  const items = checkout.orderItems || checkout.checkoutItems || [];

  return (
    <div className="min-h-screen bg-[#06090F] mt-5 pt-24 pb-24 sm:pt-32 relative overflow-hidden font-sans selection:bg-emerald-500/30">

      {/* Soft Success Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-emerald-500/[0.04] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

        <div className="space-y-6 sm:space-y-8">

          {/* --- Celebration Header --- */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-center space-y-4 mb-8 sm:mb-10"
          >
            <motion.div variants={checkPop} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-2 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={40} />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Order Confirmed
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed">
              Thank you, {checkout.shippingAddress?.firstName || 'Customer'}! We've received your order and are getting it ready.
            </p>
          </motion.div>

          {/* --- Quick Stats Grid --- */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          >
            <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-2">
              <Package size={18} className="text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-0.5">Order ID</p>
                <p className="text-sm font-semibold text-white font-mono truncate">#{checkout.orderId || checkout._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-2">
              <Calendar size={18} className="text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-0.5">Order Date</p>
                <p className="text-sm font-semibold text-white">{new Date(checkout.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/10 rounded-2xl p-4 flex flex-col gap-2">
              <Truck size={18} className="text-emerald-500" />
              <div>
                <p className="text-[11px] text-emerald-500/80 font-medium mb-0.5">Est. Arrival</p>
                <p className="text-sm font-semibold text-emerald-400">{calculateEstimatedDelivery(checkout.createdAt)}</p>
              </div>
            </div>
          </motion.div>

          {/* --- Main Order Details --- */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#ff6200]" />
                Package Summary
              </h3>
              <span className="text-xs font-medium text-slate-400">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {items.map((item, index) => (
                <div key={item.productId || index} className={`flex gap-4 ${index !== items.length - 1 ? 'pb-5 border-b border-white/[0.04]' : ''}`}>
                  <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/[0.04]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-white truncate mb-1.5">{item.name}</h4>

                      {/* Specs Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.size && (
                          <span className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            Size: {item.size}
                          </span>
                        )}
                        {item.custName && (
                          <span className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] font-medium text-slate-400 italic truncate max-w-[100px]">
                            "{item.custName}"
                          </span>
                        )}
                        {item.personalization && Object.entries(item.personalization).map(([k, v]) => (
                          <span key={k} className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] font-medium text-slate-400 flex items-center gap-1.5">
                            {v && typeof v === 'string' && v.startsWith('#') && (
                              <div className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: v }} />
                            )}
                            {v && typeof v === 'string' && v.startsWith('#') ? `${k}: ${v}` : `${k}: ${v}`}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs font-medium text-slate-500">Qty: {item.quantity}</p>
                      <p className="text-sm sm:text-base font-semibold text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="px-5 py-4 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck size={16} className="text-emerald-500/80" />
                <p className="text-[10px] sm:text-xs font-medium">Secured Payment</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-medium text-slate-400">Total Paid</p>
                <p className="text-lg sm:text-xl font-bold text-[#ff6200]">
                  ₹{items.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* --- Secondary Info --- */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white mb-1">Delivery Address</h4>
                <p className="text-xs text-slate-400 leading-relaxed truncate">
                  {checkout.shippingAddress?.address}<br />
                  {checkout.shippingAddress?.city}, {checkout.shippingAddress?.state}
                </p>
              </div>
            </div>

            <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white mb-1">Payment Method</h4>
                <p className="text-xs text-slate-400 mb-1">{checkout.paymentMethod || "Online Payment"}</p>
                {checkout.paymentDetails?.razorpay_payment_id && (
                  <p className="text-[10px] text-slate-500 font-mono mb-2 truncate">ID: {checkout.paymentDetails.razorpay_payment_id}</p>
                )}
                <p className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Payment Successful
                </p>
              </div>
            </div>
          </motion.div>

          {/* --- Action Buttons --- */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex flex-col sm:flex-row items-center gap-3 pt-4"
          >
            <button
              onClick={() => navigate("/my-orders")}
              className="w-full sm:w-1/2 px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.05] text-white text-sm font-semibold hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-1/2 px-6 py-3.5 rounded-xl bg-[#ff6200] text-white text-sm font-semibold hover:bg-[#e65800] transition-colors flex items-center justify-center gap-2 group"
            >
              Continue Shopping
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;