import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronRight, CreditCard, Truck, ShieldCheck, MapPin, Package, ShoppingBag, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Razorpay",
          totalPrice: cart.totalPrice,
          email: user.email,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      // Send payment details including payment ID to backend
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "Paid",
          paymentDetails: details,                // optional: store full response
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // finalize order after payment is recorded
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    }
  };


  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
      alert("Could not finalize the order. Contact support.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Preparing your secure checkout...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-md">
        <p className="text-red-400 font-medium mb-4">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="text-white bg-red-500 px-6 py-2 rounded-xl text-sm font-bold">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-28 pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff6200]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">Checkout</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Complete your order with confidence</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════ LEFT: Shipping & Payment ══════════ */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="lg:col-span-7 space-y-6">

            <form onSubmit={handleCreateCheckout} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Contact Information</h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Account Email</label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={user ? user.email : ""}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-300 outline-none transition-all cursor-not-allowed"
                      disabled
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Delivery Address</h3>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">First Name</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Last Name</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Full Address</label>
                    <input
                      type="text"
                      placeholder="Floor, House Number, Landmark"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Postal Code</label>
                      <input
                        type="text"
                        placeholder="6-digit ZIP"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">State / Province</label>
                      <input
                        type="text"
                        placeholder="e.g. Telangana"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXX XXX XXX"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Action */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl overflow-hidden">
                {!checkoutId ? (
                  <motion.button
                    whileHover={{ backgroundColor: "#e55a00" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#ff6200] text-white font-black py-5 rounded-[2.5rem] tracking-widest uppercase text-sm shadow-xl shadow-orange-500/20 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                        <CreditCard size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Complete Payment</h3>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                      <p className="text-slate-400 text-sm mb-6">Secure encrypted payment via Razorpay</p>
                      <div className="flex justify-center">
                        <RazorpayButton
                          amount={cart.totalPrice}
                          name={`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                          email={user?.email}
                          phone={shippingAddress.phone}
                          onSuccess={handlePaymentSuccess}
                          onError={(err) => alert("Payment failed or cancelled.")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </motion.div>

          {/* ══════════ RIGHT: Order Summary ══════════ */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl lg:sticky lg:top-32">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <Package size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Order Summary</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{cart.products.length} Items</span>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {cart.products.map((product, index) => (
                  <div key={index} className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-3 flex gap-4 transition-all duration-300">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div>
                        <h4 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors line-clamp-1">{product.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.size}</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.custName}</span>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.textColor }} />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Text</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.baseColor }} />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qty: {product.quantity}</span>
                        <span className="text-base font-black text-white">₹{product.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="text-slate-300 font-bold">₹{cart.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-slate-600" />
                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Standard Shipping</span>
                  </div>
                  <span className="text-emerald-500 font-bold text-sm">FREE</span>
                </div>
                <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white font-black tracking-tight text-lg uppercase">Total</span>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">
                      ₹{cart.totalPrice?.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Tax Included</span>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <ShoppingBag size={16} className="text-orange-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authentic Designs</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
