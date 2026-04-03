import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../../redux/slices/addressSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ShoppingBag,
  ShieldCheck,
  LayoutDashboard,
  User,
  Mail,
  ChevronRight,
  ShieldAlert,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Phone,
  Home,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
  })
};

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user } = useSelector((state) => state.auth);
  const { addresses, loading: addressesLoading } = useSelector((state) => state.addresses);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAddresses, setShowAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(fetchAddresses());
    }
  }, [user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      firstName: addr.firstName,
      lastName: addr.lastName,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      isDefault: addr.isDefault
    });
    setShowAddressForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id)).then(() => toast.success("Address deleted"));
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      dispatch(updateAddress({ id: editingAddress._id, addressData: addressForm }))
        .then(() => {
          toast.success("Address updated");
          setShowAddressForm(false);
          setEditingAddress(null);
        });
    } else {
      dispatch(addAddress(addressForm))
        .then(() => {
          toast.success("Address added");
          setShowAddressForm(false);
        });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#06090F] pt-20 pb-20 mt-9 text-slate-300 relative selection:bg-[#ff6200]/30 font-sans">

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] bg-[#ff6200]/[0.02] blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10 space-y-4 sm:space-y-6">

        <AnimatePresence mode="wait">
          {!showAddresses ? (
            <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4 sm:space-y-6">
              {/* --- Profile Header --- */}
              <motion.div
                custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] p-5 sm:p-6 flex flex-row items-center gap-4 sm:gap-6 text-left"
              >
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#ff6200] to-orange-600 p-[2px] shadow-[0_0_15px_rgba(255,98,0,0.2)]">
                    <div className="w-full h-full bg-[#111620] rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white border-[3px] border-[#111620]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  {user.role === "admin" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#111620] rounded-full flex items-center justify-center border-2 border-white/[0.04]">
                      <ShieldAlert size={12} className="text-blue-500" />
                    </div>
                  )}
                  {user.role !== "admin" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#111620] rounded-full flex items-center justify-center border-2 border-white/[0.04]">
                      <ShieldCheck size={12} className="text-emerald-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-1.5 truncate">
                    {user.name}
                  </h1>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${user.role === 'admin'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-[#ff6200]/10 text-[#ff6200] border-[#ff6200]/20'
                    }`}>
                    {user.role === 'admin' ? "Store Admin" : "Verified Member"}
                  </div>
                </div>
              </motion.div>

              {/* --- Account Details List --- */}
              <motion.div
                custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] overflow-hidden"
              >
                <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.04]">
                  <h3 className="text-xs font-semibold text-slate-400 font-bold uppercase tracking-widest">Account Info</h3>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-500 font-medium mb-0.5">Full Name</p>
                      <p className="text-sm text-white font-medium truncate">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-500 font-medium mb-0.5">Email Address</p>
                      <p className="text-sm text-white font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* --- Action Menu List --- */}
              <motion.div
                custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] overflow-hidden"
              >
                <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.04]">
                  <h3 className="text-xs font-semibold text-slate-400 font-bold uppercase tracking-widest">Menu</h3>
                </div>

                <div className="flex flex-col">
                  <button
                    onClick={() => navigate('/my-orders')}
                    className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors w-full text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#ff6200]/10 text-[#ff6200] flex items-center justify-center shrink-0 group-hover:bg-[#ff6200] group-hover:text-white transition-colors">
                      <ShoppingBag size={16} />
                    </div>
                    <div className="flex-1 text-sm font-semibold text-white">My Orders</div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate('/support/order')}
                    className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors w-full text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <MessageSquare size={16} />
                    </div>
                    <div className="flex-1 text-sm font-semibold text-white">Support Tickets</div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => setShowAddresses(true)}
                    className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors w-full text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <MapPin size={16} />
                    </div>
                    <div className="flex-1 text-sm font-semibold text-white">Saved Addresses</div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </button>

                  {user && user.role === "admin" && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors w-full text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <LayoutDashboard size={16} />
                      </div>
                      <div className="flex-1 text-sm font-semibold text-white">Admin Dashboard</div>
                      <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* --- Logout Button --- */}
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white transition-all text-sm font-semibold active:scale-[0.98]"
                >
                  <LogOut size={16} />
                  Sign Out Securely
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="addresses" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => { setShowAddresses(false); setShowAddressForm(false); }} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                  <ChevronRight size={20} className="rotate-180" />
                  <span className="font-bold text-sm uppercase tracking-widest">Back to Profile</span>
                </button>
                {!showAddressForm && (
                  <button onClick={() => { setEditingAddress(null); setAddressForm({ firstName: "", lastName: "", address: "", city: "", state: "", pincode: "", phone: "", isDefault: false }); setShowAddressForm(true); }} className="px-4 py-2 bg-[#ff6200]/10 hover:bg-[#ff6200] text-[#ff6200] hover:text-white border border-[#ff6200]/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                    <Plus size={16} /> Add New
                  </button>
                )}
              </div>

              {!showAddressForm ? (
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] p-12 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-600">
                        <MapPin size={32} />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">No saved addresses found.</p>
                      <button onClick={() => setShowAddressForm(true)} className="px-6 py-2.5 bg-[#ff6200] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Add Your First Address</button>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div key={addr._id} className={`bg-[#111620]/80 backdrop-blur-xl border ${addr.isDefault ? 'border-orange-500/30 ring-1 ring-orange-500/20' : 'border-white/[0.04]'} rounded-[1.5rem] p-5 sm:p-6 transition-all hover:bg-white/[0.02]`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                              <Home size={16} />
                            </div>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded">Default</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEdit(addr)} className="text-slate-500 hover:text-white transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(addr._id)} className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-bold">{addr.firstName} {addr.lastName}</p>
                          <p className="text-sm text-slate-400 leading-relaxed">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-2 pt-1 uppercase font-bold tracking-widest">
                            <Phone size={12} className="text-orange-500" /> +91 {addr.phone}
                          </p>
                        </div>
                        {!addr.isDefault && (
                          <button onClick={() => dispatch(setDefaultAddress(addr._id))} className="mt-4 text-[10px] text-orange-500 hover:text-orange-400 font-black uppercase tracking-widest underline decoration-dashed underline-offset-4">Set as Default</button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] p-6 sm:p-8">
                  <h3 className="text-base font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    {editingAddress ? <Pencil size={18} /> : <Plus size={18} />}
                    {editingAddress ? "Edit Address" : "New Address"}
                  </h3>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                        <input type="text" value={addressForm.firstName} onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-orange-500/50 outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                        <input type="text" value={addressForm.lastName} onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-orange-500/50 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Street Address</label>
                      <input type="text" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-orange-500/50 outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City</label>
                        <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-orange-500/50 outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pincode</label>
                        <input type="text" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-orange-500/50 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
                        <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-orange-500/50 outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                        <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-orange-500/50 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="defaultAddr" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="w-4 h-4 rounded border-white/10 bg-black/40 text-orange-500 focus:ring-[#ff6200]" />
                      <label htmlFor="defaultAddr" className="text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none">Set as default address</label>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                      <button type="submit" disabled={addressesLoading} className="flex-2 py-4 bg-[#ff6200] hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50">
                        {addressesLoading ? "Saving..." : (editingAddress ? "Update Address" : "Save Address")}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Profile;