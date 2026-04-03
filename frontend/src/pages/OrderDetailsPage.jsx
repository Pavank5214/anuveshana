import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  ArrowLeft,
  Check,
  Smartphone,
  Printer,
  ShoppingBag,
  ExternalLink,
  Receipt,
  Clock,
  Box,
  Copy,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Mail,
  User
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" }
  })
};

const OrderDetailsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06090F] pt-24 pb-20 mt-5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-24 bg-white/5 rounded-full" />
          <div className="h-10 w-48 bg-white/5 rounded-xl" />
          <div className="h-32 w-full bg-white/5 rounded-[2rem]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-white/5 rounded-[2rem]" />
            <div className="h-96 bg-white/5 rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen bg-[#06090F] flex items-center justify-center p-4">
      <div className="bg-[#111620] border border-red-500/10 p-8 rounded-[2rem] text-center max-w-sm w-full">
        <p className="text-red-500 font-medium text-lg mb-2">Order Not Found</p>
        <p className="text-slate-400 mb-8 text-sm">{error}</p>
        <Link to="/my-orders" className="w-full flex justify-center py-4 bg-white text-black rounded-xl font-semibold hover:bg-slate-200 transition-colors">
          Return to Orders
        </Link>
      </div>
    </div>
  );

  if (!orderDetails || Object.keys(orderDetails).length === 0) return null;

  const { shippingAddress } = orderDetails;

  const statusMap = {
    "Placed": 0, "Processing": 1, "Printing": 2, "Shipped": 3, "Delivered": 4, "Cancelled": -1
  };

  const activeStepIndex = statusMap[orderDetails.status] ?? 0;

  const steps = [
    { label: "Order Placed", icon: Receipt },
    { label: "Processing", icon: Box },
    { label: "Printing", icon: Printer },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: Package }
  ];

  return (
    <div className="min-h-screen bg-[#06090F] text-slate-300 font-sans mt-5 pb-32 md:pb-24 pt-24 md:pt-32 relative selection:bg-[#ff6200]/30">

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#ff6200]/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* --- Header --- */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
          <Link to="/my-orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                Order <span className="text-[#ff6200]">Details</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-widest shrink-0">Reference ID</span>
                <button
                  onClick={() => handleCopy(orderDetails.orderId || orderDetails._id, "Order Reference")}
                  className="group/copy flex items-center gap-2.5 text-white font-mono bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-2 rounded-xl border border-white/[0.05] transition-all"
                >
                  #{orderDetails.orderId || orderDetails._id.slice(-8).toUpperCase()}
                  <Copy size={12} className="text-slate-600 group-hover/copy:text-[#ff6200] transition-colors" />
                </button>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-slate-400 font-bold uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                  {new Date(orderDetails.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            <button className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] text-white transition-all text-sm font-medium">
              <Printer size={16} /> Print Invoice
            </button>
          </div>
        </motion.div>

        {/* --- Cancelled Status Banner --- */}
        {orderDetails.status === 'Cancelled' && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
            className="mb-8 p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-110 transition-transform">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Order Cancelled</p>
                <h4 className="text-white text-base font-bold">This order has been cancelled and will not be processed.</h4>
              </div>
            </div>
            <Link
              to={`/support/order?orderId=${orderDetails._id}`}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shrink-0"
            >
              Contact Support <ChevronRight size={14} />
            </Link>
          </motion.div>
        )}

        {/* --- Track Status (Cool & No Slide) --- */}
        {orderDetails.status !== 'Cancelled' && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="mb-8"
          >
            <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
              {/* Ambient tracker glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff6200]/[0.02] blur-[40px] pointer-events-none" />

              <div className="relative w-full max-w-3xl mx-auto">

                {/* Background Track Line */}
                <div className="absolute top-5 sm:top-6 left-0 w-full h-1.5 bg-white/[0.03] rounded-full -z-10 translate-y-[-50%]" />

                {/* Active Glowing Line */}
                <div
                  className="absolute top-5 sm:top-6 left-0 h-1.5 bg-gradient-to-r from-[#ff6200] to-orange-400 rounded-full transition-all duration-1000 ease-out -z-10 translate-y-[-50%] shadow-[0_0_12px_rgba(255,98,0,0.6)]"
                  style={{ width: `${(Math.max(0, activeStepIndex) / (steps.length - 1)) * 100}%` }}
                />

                {/* Flex Container to perfectly distribute nodes */}
                <div className="flex justify-between items-start">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < activeStepIndex;
                    const isActive = idx === activeStepIndex;
                    const isPending = idx > activeStepIndex;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-3 w-16 sm:w-24 relative z-10">

                        {/* Step Circle with mask background so line doesn't bleed through */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-[#111620] ${isCompleted
                          ? "border-[#ff6200] text-[#ff6200]"
                          : isActive
                            ? "border-[#ff6200] text-white shadow-[0_0_20px_rgba(255,98,0,0.4)]"
                            : "border-white/10 text-slate-600"
                          }`}>
                          {isCompleted ? <Check size={18} className="text-[#ff6200]" /> : <step.icon size={18} className={isActive ? "text-[#ff6200]" : ""} />}
                        </div>

                        {/* Step Label */}
                        <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider text-center transition-colors duration-500 ${isCompleted || isActive ? "text-white" : "text-slate-600"
                          }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Tracking Action Banner --- */}
        {orderDetails.status !== 'Cancelled' && (orderDetails.trackingId || orderDetails.trackingUrl) && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1.5}
            className="mb-8 p-5 sm:p-6 rounded-[2rem] bg-gradient-to-r from-[#ff6200]/10 to-transparent border border-[#ff6200]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ff6200]/20 flex items-center justify-center text-[#ff6200] shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-[#ff6200] text-xs font-semibold uppercase tracking-wider mb-1">Out for Delivery</p>
                <div className="text-white text-sm font-medium">
                  Tracking ID: <span className="font-mono text-slate-300 ml-1">{orderDetails.trackingId}</span>
                </div>
              </div>
            </div>
            {orderDetails.trackingUrl && (
              <a href={orderDetails.trackingUrl} target="_blank" rel="noreferrer" className="hidden md:flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-[#ff6200] hover:bg-[#e65800] rounded-xl text-white text-sm font-semibold transition-colors">
                Track Package <ExternalLink size={16} />
              </a>
            )}
          </motion.div>
        )}

        {/* --- Main Content Layout --- */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">

          {/* Left Column (Items & Summary) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6 sm:gap-8">

            {/* Items Card */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[2rem] p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-6 flex items-center gap-3">
                <ShoppingBag size={18} className="text-[#ff6200]" /> Items Ordered
              </h3>
              <div className="flex flex-col gap-6">
                {orderDetails.orderItems?.map((item, index) => (
                  <div key={index} className={`group/item ${index !== orderDetails.orderItems.length - 1 ? 'pb-8 border-b border-white/[0.04]' : ''}`}>
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Image & Product Info Group */}
                      <div className="flex flex-1 gap-5">
                        <div className="w-20 h-24 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-white/5 border border-white/[0.05] shrink-0 shadow-2xl">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col pt-1">
                          <Link to={`/product/${item.productId}`} className="text-base sm:text-lg font-bold text-white hover:text-[#ff6200] transition-colors line-clamp-1 mb-2">
                            {item.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-slate-400">Qty: {item.quantity}</span>
                            {item.size && <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-orange-400/80">{item.size}</span>}
                          </div>

                          {/* Personalization Section */}
                          {(item.custName || (item.personalization && Object.keys(item.personalization instanceof Map ? Object.fromEntries(item.personalization) : item.personalization).length > 0)) && (
                            <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.05] space-y-3">
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1 h-3 bg-[#ff6200] rounded-full" />
                                Customization Details
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                {item.custName && (
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Selected Name</span>
                                    <span className="text-[11px] font-bold text-white italic">"{item.custName}"</span>
                                  </div>
                                )}
                                {item.personalization && Object.entries(item.personalization instanceof Map ? Object.fromEntries(item.personalization) : item.personalization).map(([k, v]) => (
                                  <div key={k} className="flex flex-col gap-0.5">
                                    <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">{k}</span>
                                    <div className="flex items-center gap-2">
                                      {v && typeof v === 'string' && v.startsWith('#') && (
                                        <div className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: v }} />
                                      )}
                                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{v}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="flex sm:flex-col justify-between items-end sm:justify-start gap-1 min-w-[140px] pt-1">
                        <p className="text-xl sm:text-2xl font-black text-white tracking-tighter italic">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-700 tracking-widest uppercase">₹{item.price.toLocaleString()} / unit</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Price Breakdown */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2.5} className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[2rem] p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-6 flex items-center gap-3">
                <Receipt size={18} className="text-[#ff6200]" /> Payment Summary
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{orderDetails.orderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="h-px bg-white/[0.04] my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-base text-white font-medium">Total Amount</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#ff6200]">
                    ₹{orderDetails.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Info Cards) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8">

            {/* Delivery Details */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[2rem] p-6 sm:p-8">
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-3">
                <MapPin size={18} className="text-[#ff6200]" /> Delivery Address
              </h3>
              {shippingAddress ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Customer Account</p>
                    <p className="text-white text-sm font-medium flex items-center gap-2">
                      <User size={12} className="text-orange-500" />
                      {orderDetails.user?.name || `${shippingAddress.firstName} ${shippingAddress.lastName}`}
                    </p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-5 flex items-center gap-2">
                      <Mail size={10} className="text-slate-700" />
                      {orderDetails.user?.email || orderDetails.email}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/[0.04]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Delivery To</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Address</p>
                    <p className="text-white text-sm font-medium leading-relaxed">
                      {shippingAddress.address}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Contact</p>
                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                      <Smartphone size={14} className="text-slate-400" />
                      +91 {shippingAddress.phone}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No address provided.</p>
              )}
            </motion.div>

            {/* Payment Status */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3.5} className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[2rem] p-6 sm:p-8">
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-3">
                <CreditCard size={18} className="text-[#ff6200]" /> Payment Info
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Method</p>
                  <p className="text-white text-sm font-medium">{orderDetails.paymentMethod || "Razorpay"}</p>
                  {orderDetails.paymentDetails?.razorpay_payment_id && (
                    <button
                      onClick={() => handleCopy(orderDetails.paymentDetails.razorpay_payment_id, "Transaction ID")}
                      className="group/tx flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono opacity-80 hover:opacity-100 transition-opacity"
                    >
                      TXN: {orderDetails.paymentDetails.razorpay_payment_id}
                      <Copy size={10} className="text-slate-600 group-hover/tx:text-orange-500" />
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2.5">Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${orderDetails.isPaid
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-[#ff6200]/10 text-[#ff6200] border-[#ff6200]/20'
                    }`}>
                    {orderDetails.isPaid ? <Check size={14} /> : <Clock size={14} />}
                    {orderDetails.isPaid ? "Paid Successfully" : "Payment Pending"}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* --- Help Section at Bottom --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-[3rem] bg-[#111620]/40 border border-white/[0.05] flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#ff6200]/50 to-transparent" />
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-slate-400">
            <HelpCircle size={28} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Need Help with this Order?</h3>
          <p className="text-slate-500 text-sm max-w-sm mb-10 leading-relaxed uppercase font-bold tracking-widest opacity-60">
            Our support team is available mon-sat to assist you with tracking, quality, or cancellations.
          </p>
          <Link
            to={`/support/order?orderId=${orderDetails._id}`}
            className="px-10 py-4 bg-white text-black hover:bg-[#ff6200] hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95"
          >
            Contact Support Center
          </Link>
        </motion.div>
      </div>

      {/* --- Mobile Sticky Bottom Action Bar --- */}
      {orderDetails.status !== 'Cancelled' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#06090F]/90 backdrop-blur-xl border-t border-white/[0.05] z-50 flex gap-3">
          {orderDetails.trackingUrl ? (
            <a href={orderDetails.trackingUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#ff6200] active:bg-[#e65800] rounded-xl text-white text-sm font-semibold transition-colors">
              Track Order <ExternalLink size={16} />
            </a>
          ) : (
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/[0.05] active:bg-white/[0.1] rounded-xl text-white text-sm font-semibold transition-colors border border-white/[0.05]">
              <Printer size={16} /> Invoice
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default OrderDetailsPage;