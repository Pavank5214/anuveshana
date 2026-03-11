import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  Truck,
  CreditCard,
  MapPin,
  ChevronLeft,
  CheckCircle2,
  Smartphone,
  Info,
  ExternalLink,
  Printer,
  Layers
} from "lucide-react";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
  })
};

const OrderDetailsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="h-8 w-40 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-20 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          <div className="h-96 w-full bg-white/5 border border-white/10 rounded-[3rem] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-[2.5rem] text-center max-w-md backdrop-blur-xl">
        <p className="text-red-400 font-black text-2xl mb-4 uppercase tracking-tighter">Sync Error</p>
        <p className="text-slate-500 mb-8 text-sm">{error}</p>
        <Link to="/my-orders" className="inline-flex px-10 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all">Go Back</Link>
      </div>
    </div>
  );

  if (!orderDetails || Object.keys(orderDetails).length === 0) return null;

  const { shippingAddress } = orderDetails;

  // Stepper Logic for 3D Printing Workflow
  const statusMap = {
    "Placed": 0,
    "Processing": 1,
    "Printing": 2,
    "Shipped": 3,
    "Delivered": 4,
    "Cancelled": -1
  };

  const activeStepIndex = statusMap[orderDetails.status] ?? 0;

  const steps = [
    { label: "Placed", icon: Package, completed: activeStepIndex >= 0 },
    { label: "Processing", icon: Info, completed: activeStepIndex >= 1 },
    { label: "Printing", icon: Layers, completed: activeStepIndex >= 2 },
    { label: "Shipping", icon: Truck, completed: activeStepIndex >= 3 },
    { label: "Delivered", icon: CheckCircle2, completed: activeStepIndex >= 4 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-32 pb-24 relative overflow-hidden font-sans">
      {/* Soft Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-600/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header Section */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-10 flex items-end justify-between">
          <div>
            <Link to="/my-orders" className="group inline-flex items-center gap-2 text-slate-500 hover:text-orange-400 transition-all mb-6">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to History</span>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2">
              Order <span className="text-[#ff6200]">Summary</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Order ID: <span className="text-slate-300">#{orderDetails._id}</span>
            </p>
          </div>
          <button className="hidden sm:flex p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
            <Printer size={20} />
          </button>
        </motion.div>

        {/* Status Stepper */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mb-8 relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 relative z-10">
                <motion.div
                  animate={idx === activeStepIndex ? {
                    boxShadow: [
                      "0 0 0px rgba(255,98,0,0)",
                      "0 0 35px rgba(255,98,0,0.4)",
                      "0 0 0px rgba(255,98,0,0)"
                    ],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${step.completed ? "bg-[#ff6200] border-[#ff6200] text-white" : "bg-[#0B0F19] border-white/10 text-slate-600"
                    }`}
                >
                  <step.icon size={18} />
                </motion.div>
                <motion.span
                  animate={idx === activeStepIndex ? { opacity: [0.4, 1, 0.4] } : {}}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className={`text-[9px] font-black uppercase tracking-widest ${idx <= activeStepIndex ? "text-white" : "text-slate-600"}`}
                >
                  {step.label}
                </motion.span>
                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="absolute top-5 left-10 w-[calc(100vw/5)] sm:w-[110px] h-[2px] bg-white/5 -z-10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: step.completed ? "100%" : 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-[#ff6200]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tracking Information Notification */}
        {(orderDetails.trackingId || orderDetails.trackingUrl) && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1.5}
            className="mb-8 p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-3xl overflow-hidden relative group"
          >
            {/* Glow Accent */}
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-orange-500/10 to-transparent transition-opacity group-hover:opacity-100" />

            <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 shrink-0 group-hover:scale-105 transition-transform duration-500">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-400/80 uppercase tracking-[0.3em] mb-2 leading-none">Shipment Identified</p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                    {orderDetails.courier ? orderDetails.courier : 'Standard Delivery'}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-l border-white/10 pl-3">
                    <span className="text-[9px] text-orange-500/60">ID:</span>
                    <code className="bg-white/5 px-2 py-0.5 rounded text-slate-300 font-mono">{orderDetails.trackingId || 'Wait For Dispatch'}</code>
                  </div>
                </div>
              </div>
            </div>

            {orderDetails.trackingUrl && (
              <a
                href={orderDetails.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all group/btn active:scale-95 shadow-xl"
              >
                Track Order <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </motion.div>
        )}

        {/* Main Collective Receipt Card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {/* Top Plate: Essential Info */}
          <div className="p-8 sm:p-12 border-b border-white/5 bg-white/[0.01]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Shipment Destination</h4>
                  {shippingAddress ? (
                    <div className="space-y-1">
                      <p className="text-lg font-black text-white tracking-tight uppercase">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed italic opacity-80">
                        {shippingAddress.address}, {shippingAddress.city}<br />
                        {shippingAddress.state}, {shippingAddress.pincode}
                      </p>
                      <div className="flex items-center gap-2 pt-2 text-slate-500">
                        <Smartphone size={12} />
                        <span className="text-xs font-bold text-slate-500">+91 {shippingAddress.phone}</span>
                      </div>
                    </div>
                  ) : <p className="text-slate-500 italic text-xs">Standard Logistics</p>}
                </div>
              </div>
              <div className="space-y-6 sm:text-right">
                <div>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Timeline</h4>
                  <p className="text-xs font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2 sm:justify-end">
                    Created <span className="text-orange-400">{new Date(orderDetails.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2 sm:justify-end">
                    <Calendar size={12} />
                    Est. Arrival: {new Date(new Date(orderDetails.createdAt).setDate(new Date(orderDetails.createdAt).getDate() + 10)).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Payment Matrix</h4>
                  <div className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 sm:justify-end">
                    {orderDetails.paymentMethod || "Razorpay API"} <div className={`w-2 h-2 rounded-full ${orderDetails.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                  {orderDetails.paymentDetails?.razorpay_payment_id && (
                    <p className="text-[9px] font-bold text-slate-500 mt-2 sm:text-right uppercase tracking-wider">
                      Payment ID: <span className="text-slate-300">{orderDetails.paymentDetails.razorpay_payment_id}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Items Section */}
          <div className="px-8 sm:px-12 py-10 space-y-10 border-b border-white/5">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Curated Manifest</h3>
            <div className="space-y-12">
              {orderDetails.orderItems?.map((item) => (
                <div key={item.productId} className="flex flex-col sm:flex-row items-start gap-8 group">
                  <div className="w-full sm:w-28 h-40 shrink-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-xl group-hover:border-orange-500/20 transition-all">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 space-y-4 pt-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link to={`/product/${item.productId}`} className="text-xl font-black text-white uppercase tracking-tighter hover:text-orange-400 transition-colors inline-flex items-center gap-2">
                          {item.name}
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-lg">x{item.quantity} Unit</span>
                          <span className="text-[10px] font-black text-[#ff6200] uppercase tracking-[0.2em]">{item.size || "Original Size"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">@ ₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    {item.custName && (
                      <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 inline-block">
                        <p className="text-[9px] font-black text-orange-400/60 uppercase tracking-widest mb-1">Personalization</p>
                        <p className="text-xs font-bold text-white tracking-widest uppercase">"{item.custName}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown Footer */}
          <div className="p-12 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-end gap-10">
            <div className="w-full sm:w-auto space-y-4">
              <div className="p-6 rounded-[2rem] bg-orange-600/5 border border-orange-600/10 max-w-[280px]">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CreditCard size={12} /> Fast Checkout Protection
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Your payment is secured by industry standard SSL encryption.</p>
              </div>
            </div>
            <div className="w-full sm:w-64 space-y-4">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-slate-300">₹{orderDetails.orderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                <span>Logistics</span>
                <span className="text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                <span>GST (Included)</span>
                <span className="text-slate-300">₹0.00</span>
              </div>
              <div className="h-[1px] bg-white/10 w-full my-4" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</span>
                <span className="text-4xl font-black text-white tracking-tighter">
                  ₹{orderDetails.orderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Support Hub */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mt-12 text-center space-y-6"
        >
          <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">Precision-crafted for you at <span className="text-slate-400">Anuveshana Technologies</span></p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">Support Center</button>
            <button className="px-8 py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">Report Issue</button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;
