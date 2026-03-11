import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { motion } from "framer-motion";
import {
  LogOut,
  Mail,
  ShoppingBag,
  ShieldCheck,
  ArrowUpRight,
  User
} from "lucide-react";

/**
 * Profile Component - High-Spec Workspace
 * A high-precision, functional layout for professional account management.
 */
const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050608] pt-32 pb-24 text-slate-400 font-sans selection:bg-orange-500/30">
      <div className="max-w-6xl mx-auto px-6">

        {/* Profile Identity Stripe */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0B0E] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >

          {/* Header Action Bar */}
          <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-[#ff6200] flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-orange-500/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-white tracking-tighter mb-1">{user.name}</h1>
                <p className="text-sm font-medium text-slate-500">{user.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                  <span className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12} />
                    Verified {user.role || 'Member'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] flex items-center gap-3 active:scale-95"
            >
              Log Out
              <LogOut size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Account Specifications */}
            <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                <User size={14} className="text-orange-500" />
                Account Details
              </h3>

              <div className="grid grid-cols-1 gap-10">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-1.5 transition-colors group-hover:text-orange-500">Legal Name</label>
                  <p className="text-xl font-bold text-white tracking-tight">{user.name}</p>
                </div>
                <div className="group">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-1.5 transition-colors group-hover:text-orange-500">Primary Email</label>
                  <p className="text-xl font-bold text-white tracking-tight">{user.email}</p>
                </div>
                <div className="group">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-1.5 transition-colors group-hover:text-orange-500">User Role</label>
                  <p className="text-xl font-bold text-white tracking-tight uppercase">{user.role || 'Customer'}</p>
                </div>
              </div>
            </div>

            {/* Workflow & Actions */}
            <div className="p-8 md:p-12 space-y-12">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <ShoppingBag size={14} className="text-orange-500" />
                Workflow
              </h3>

              <div
                onClick={() => navigate('/my-orders')}
                className="group relative bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-500 shadow-xl overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#ff6200] flex items-center justify-center text-white shadow-2xl shadow-orange-500/20 group-hover:scale-105 transition-transform">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter">Order History</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium group-hover:text-slate-400">View status and invoices</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:bg-orange-500 transition-all duration-300">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
                <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[#ff6200]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium uppercase tracking-wider">
                  For information updates or security requests, please reach out to our team.
                  All account data is secured with industry-standard protocols.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Global Footer */}
        <div className="mt-12 flex items-center justify-between px-6 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">
          <span>© Anoveshana Technologies</span>
          <div className="flex items-center gap-6 text-slate-800/60">
            <span className="flex items-center gap-2">System Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
