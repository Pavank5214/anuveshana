import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout, setCheckout } from "../../redux/slices/checkoutSlice";
import { fetchAddresses } from "../../redux/slices/addressSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  Package,
  ShoppingBag,
  ArrowRight,
  Check,
  Lock,
  User,
  Phone,
  Home,
  Mail,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// Reusable floating-label input
const FloatingInput = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required = true, disabled = false }) => (
  <div className="relative group">
    <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-400 transition-colors pointer-events-none">
      {Icon && <Icon size={16} />}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full bg-[#0B0F19] border border-white/10 rounded-xl ${Icon ? 'pl-10 sm:pl-11' : 'pl-4'} pr-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-slate-600 outline-none
        focus:border-orange-500/50 focus:shadow-[0_0_0_3px_rgba(255,98,0,0.08)] transition-all duration-300
        ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    />
    <span className="absolute -top-2 left-3 px-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 bg-[#121620]">
      {label}
    </span>
  </div>
);

// Step indicator component
const StepIndicator = ({ step, currentStep, label }) => {
  const isCompleted = currentStep > step;
  const isActive = currentStep === step;
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500
        ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
            isActive ? 'bg-[#ff6200] text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/10' :
              'bg-white/5 text-slate-600 border border-white/10'}`}
      >
        {isCompleted ? <Check size={14} /> : step}
      </div>
      <span
        className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors hidden sm:block
        ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-600'}`}
      >
        {label}
      </span>
    </div>
  );
};

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { addresses, loading: addressesLoading } = useSelector((state) => state.addresses);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    phone: "",
  });
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const currentStep = checkoutId ? 3 : 1;

  useEffect(() => {
    if (!loading && (!cart || !cart.products || cart.products.length === 0)) {
      navigate("/");
    }
  }, [cart, navigate, loading]);

  useEffect(() => {
    if (user) {
      dispatch(fetchAddresses());
    }
  }, [user, dispatch]);

  // Pre-fill default address if available
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      if (defaultAddr && !shippingAddress.address) {
        setShippingAddress({
          firstName: defaultAddr.firstName || "",
          lastName: defaultAddr.lastName || "",
          address: defaultAddr.address || "",
          city: defaultAddr.city || "",
          pincode: defaultAddr.pincode || "",
          state: defaultAddr.state || "",
          country: "India",
          phone: defaultAddr.phone || ""
        });
      }
    }
  }, [addresses]);

  const handleSelectAddress = (addr) => {
    setShippingAddress({
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      address: addr.address || "",
      city: addr.city || "",
      pincode: addr.pincode || "",
      state: addr.state || "",
      country: "India",
      phone: addr.phone || ""
    });
    setShowSavedAddresses(false);
  };

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
    setPaymentProcessing(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "Paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setPaymentProcessing(false);
      setPaymentSuccess(true);

      // Short delay for user to see the success state
      setTimeout(async () => {
        await handleFinalizeCheckout(checkoutId);
      }, 1500);

    } catch (error) {
      console.error(error);
      setPaymentProcessing(false);
      alert("Payment failed. Please try again.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        { saveAddress: saveAddressToProfile },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      dispatch(setCheckout(response.data));
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
      alert("Could not finalize the order. Contact support.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">Preparing checkout...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
      <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl text-center max-w-sm">
        <p className="text-red-400 text-sm font-medium mb-4">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="text-white bg-red-500 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-20 sm:pt-28 pb-12 mt-9 sm:pb-20 relative">
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-orange-600/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <StepIndicator step={1} currentStep={currentStep} label="Shipping" />
            <div className={`flex-1 h-px mx-2 sm:mx-4 transition-colors duration-500 ${currentStep > 1 ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
            <StepIndicator step={2} currentStep={currentStep} label="Review" />
            <div className={`flex-1 h-px mx-2 sm:mx-4 transition-colors duration-500 ${currentStep > 2 ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
            <StepIndicator step={3} currentStep={currentStep} label="Payment" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="lg:col-span-3 space-y-5">
            <AnimatePresence mode="wait">
              {paymentSuccess ? (
                <motion.div key="finalizing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#ff6200]/[0.03] to-transparent pointer-events-none" />
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                      <Check size={40} className="sm:size-48" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Finalizing Your Order</h2>
                      <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-xs mx-auto">We're wrapping things up and securing your items. You'll be redirected in a moment.</p>
                    </div>
                    <div className="mt-12 space-y-4 max-w-sm mx-auto">
                      <div className="h-6 bg-white/5 rounded-lg w-full animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-md w-3/4 mx-auto animate-pulse" />
                      <div className="flex justify-center gap-2 mt-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, scale: 0.98 }} className="space-y-5">
                  <form onSubmit={handleCreateCheckout} className="space-y-5">
                    <div className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2.5 px-5 py-3.5 sm:py-4 border-b border-white/[0.06] bg-white/[0.02]">
                        <Mail size={15} className="text-orange-400" />
                        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Contact</h3>
                      </div>
                      <div className="p-4 sm:p-5">
                        <FloatingInput label="Email" icon={Mail} type="email" value={user ? user.email : ""} disabled placeholder="your@email.com" />
                        <p className="text-[10px] text-slate-600 mt-2 ml-1">Logged in as {user?.email}</p>
                      </div>
                    </div>

                    <div className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3.5 sm:py-4 border-b border-white/[0.06] bg-white/[0.02]">
                        <div className="flex items-center gap-2.5">
                          <MapPin size={15} className="text-orange-400" />
                          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Shipping Address</h3>
                        </div>
                        {user && addresses.length > 0 && (
                          <button type="button" onClick={() => setShowSavedAddresses(!showSavedAddresses)} className="text-[10px] font-black uppercase text-orange-500 hover:text-orange-400 transition-colors tracking-widest border-b border-orange-500/20">
                            {showSavedAddresses ? "Enter Manual" : "Select Saved"}
                          </button>
                        )}
                      </div>

                      <div className="p-4 sm:p-5">
                        <AnimatePresence mode="wait">
                          {showSavedAddresses ? (
                            <motion.div key="saved" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                              {addresses.map((addr) => (
                                <div key={addr._id} onClick={() => handleSelectAddress(addr)} className="group p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/[0.02] transition-all">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{addr.firstName} {addr.lastName}</p>
                                    {addr.isDefault && <span className="text-[8px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded">Default</span>}
                                  </div>
                                  <p className="text-xs text-slate-500 leading-relaxed truncate">{addr.address}, {addr.city}</p>
                                </div>
                              ))}
                            </motion.div>
                          ) : (
                            <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <FloatingInput label="First Name" icon={User} value={shippingAddress.firstName || ""} onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })} placeholder="John" />
                                <FloatingInput label="Last Name" icon={User} value={shippingAddress.lastName || ""} onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })} placeholder="Doe" />
                              </div>
                              <FloatingInput label="Street Address" icon={Home} value={shippingAddress.address || ""} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} placeholder="Floor, House Number, Landmark" />
                              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <FloatingInput label="City" value={shippingAddress.city || ""} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} placeholder="Hyderabad" />
                                <FloatingInput label="ZIP Code" value={shippingAddress.pincode || ""} onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })} placeholder="500001" />
                              </div>
                              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <FloatingInput label="State" value={shippingAddress.state || ""} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} placeholder="Telangana" />
                                <FloatingInput label="Phone" icon={Phone} type="tel" value={shippingAddress.phone || ""} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                              </div>

                              {user && (
                                <div className="flex items-center gap-2 pt-2 px-1">
                                  <input
                                    type="checkbox"
                                    id="saveAddr"
                                    checked={saveAddressToProfile}
                                    onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 bg-black/40 text-orange-500 focus:ring-[#ff6200]"
                                  />
                                  <label htmlFor="saveAddr" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer select-none">Save this address to my profile</label>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* CTA */}
                    <AnimatePresence mode="wait">
                      {!checkoutId ? (
                        <motion.button
                          key="submit"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#ff6200] to-orange-500 hover:from-[#e55a00] hover:to-orange-600 text-white font-black py-4 rounded-xl tracking-wider uppercase text-xs sm:text-sm shadow-xl shadow-orange-500/15 transition-all flex items-center justify-center gap-2.5 group"
                        >
                          <Lock size={14} />
                          <span>Continue to Payment</span>
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </motion.button>
                      ) : (
                        <motion.div
                          key="payment"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden"
                        >
                          <div className="flex items-center gap-2.5 px-5 py-3.5 sm:py-4 border-b border-white/[0.06] bg-white/[0.02]">
                            <CreditCard size={15} className="text-orange-400" />
                            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Payment</h3>
                          </div>
                          <div className="p-5 sm:p-6 text-center">

                            <div className="flex justify-center">
                              <RazorpayButton
                                amount={cart.totalPrice}
                                name={`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                                email={user?.email}
                                phone={shippingAddress.phone}
                                onSuccess={handlePaymentSuccess}
                                onError={(err) => alert("Payment failed or cancelled.")}
                                isProcessing={paymentProcessing}
                                isSuccess={paymentSuccess}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Trust row */}
                    <div className="flex items-center justify-center gap-6 pt-2">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Lock size={11} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">SSL Secure</span>
                      </div>
                      <div className="w-px h-3 bg-white/10" />
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <ShieldCheck size={11} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Safe Checkout</span>
                      </div>
                      <div className="w-px h-3 bg-white/10" />
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Truck size={11} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Tracked Delivery</span>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ═══════ RIGHT: Order Summary ═══════ */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="lg:col-span-2"
          >
            <div className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden lg:sticky lg:top-28">
              {/* Summary Header */}
              <div className="flex items-center justify-between px-5 py-3.5 sm:py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={15} className="text-orange-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Order</h3>
                </div>
                <span className="text-[10px] font-black text-slate-500 bg-white/5 border border-white/[0.06] px-2.5 py-1 rounded-full">
                  {cart.products.length} {cart.products.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Products */}
              <div className="divide-y divide-white/[0.04] max-h-[320px] sm:max-h-[400px] overflow-y-auto scrollbar-hide">
                {cart.products.map((product, index) => (
                  <div key={index} className="flex gap-3 p-3.5 sm:p-4 group hover:bg-white/[0.02] transition-colors">
                    <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-white/[0.06] bg-[#0B0F19]">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">{product.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {product.baseColor && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.baseColor }} />
                              <span className="text-[8px] font-bold text-slate-500 uppercase">Base</span>
                            </span>
                          )}
                          {product.personalization && Object.entries(product.personalization).map(([k, v]) => (
                            <span key={k} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 shrink-0">
                              {v && typeof v === 'string' && v.startsWith('#') && (
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v }} />
                              )}
                              <span className="text-[8px] font-bold text-slate-500 uppercase">
                                {v && typeof v === 'string' && v.startsWith('#') ? `${k}: ${v}` : `${k}: ${v}`}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-bold text-slate-600">× {product.quantity}</span>
                        <span className="text-xs sm:text-sm font-black text-white">₹{product.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/[0.06] p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
                  <span className="text-sm font-bold text-slate-300">₹{cart.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-slate-600" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shipping</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">FREE</span>
                </div>

                <div className="pt-3 mt-1 border-t border-white/[0.06] flex justify-between items-baseline">
                  <span className="text-sm font-black text-white uppercase tracking-tight">Total</span>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">
                      ₹{cart.totalPrice?.toLocaleString()}
                    </span>
                    <span className="block text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Inclusive of all taxes</span>
                  </div>
                </div>
              </div>

              {/* Free shipping banner */}
              <div className="mx-4 mb-4 sm:mx-5 sm:mb-5 px-3.5 py-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10 flex items-center gap-2.5">
                <Package size={14} className="text-emerald-500 shrink-0" />
                <p className="text-[10px] sm:text-[11px] text-emerald-400/80 font-medium leading-tight">
                  You qualify for <span className="font-bold text-emerald-400">free standard shipping</span> on this order
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div >
    </div >
  );
};

export default Checkout;
