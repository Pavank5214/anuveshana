import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, Calendar, ShoppingBag, MapPin, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

const checkPop = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 }
  }
};

const OrderConfirmationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  // Clear the cart when the order is confirmed
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
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-32 pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ff6200]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {checkout && (
          <div className="space-y-8">

            {/* Celebration Header */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="text-center space-y-4 mb-12"
            >
              <motion.div variants={checkPop} className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                <CheckCircle2 size={48} />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Confirmed!</span>
              </h1>
              <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                Thank you, {checkout.shippingAddress.firstName}! Your custom creation is now in our manufacturing queue.
              </p>
            </motion.div>

            {/* Quick Stats Card */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</p>
                  <p className="text-sm font-bold text-white mt-0.5 truncate max-w-[120px]">{checkout._id}</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order Date</p>
                  <p className="text-sm font-bold text-white mt-0.5">{new Date(checkout.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estimated Arrival</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{calculateEstimatedDelivery(checkout.createdAt)}</p>
                </div>
              </div>
            </motion.div>

            {/* Main Order Details */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <ShoppingBag size={18} className="text-orange-400" />
                  Package Details
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  {checkout.checkoutItems.length} Products
                </span>
              </div>

              <div className="p-6 divide-y divide-white/5">
                {checkout.checkoutItems.map((item) => (
                  <div key={item.productId} className="flex flex-col sm:flex-row items-start gap-6 py-6 first:pt-0 last:pb-0 group">
                    <div className="w-24 h-28 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">{item.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Package size={12} className="text-slate-600" />
                            {item.size}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            "{item.custName}"
                          </span>
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                            <div className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: item.textColor }} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Text</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                            <div className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: item.baseColor }} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Quantity</p>
                          <p className="text-sm font-bold text-slate-400">× {item.quantity}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Unit Price</p>
                          <p className="text-sm font-bold text-slate-400">₹{item.price}</p>
                        </div>
                        <div className="text-right sm:text-left space-y-0.5 ml-auto sm:ml-0">
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Line Total</p>
                          <p className="text-base font-black text-white">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Footer */}
              <div className="px-8 py-6 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <p className="text-xs font-medium tracking-tight">Your order is secured by 256-bit encryption</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">
                    ₹{checkout.checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Secondary Info */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <CreditCard size={18} />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight">Payment Method</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-300 uppercase tracking-wider">{checkout.paymentMethod || "Razorpay"}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest inline-flex items-center gap-1">
                    <ShieldCheck size={10} />
                    Status: Verified
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <MapPin size={18} />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight">Delivery Details</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white line-clamp-1">{checkout.shippingAddress.address}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                    {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/my-orders")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                View My Orders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#e55a00" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ff6200] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
