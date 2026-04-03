import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../redux/slices/authSlice";
import { fetchCart, mergeCart } from "../redux/slices/cartSlice";
import { Loader2, Mail, Lock, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading, error } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);

  // Capture where the user came from
  let from = location.state?.from?.pathname || new URLSearchParams(location.search).get("redirect") || "/";
  // Ensure absolute path
  if (!from.startsWith("/")) from = `/${from}`;

  // Store in sessionStorage to survive Google OAuth redirect
  useEffect(() => {
    if (from !== "/") {
      sessionStorage.setItem("redirectPath", from);
    }
  }, [from]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (user && !hasNavigated.current) {
      hasNavigated.current = true;
      const storedRedirect = sessionStorage.getItem("redirectPath");
      let target = storedRedirect || from;
      if (target.includes("login") || target.includes("register")) target = "/";

      if (guestId && cart?.products?.length > 0) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          sessionStorage.removeItem("redirectPath");
          navigate(target, { replace: true });
        });
      } else {
        // Even if no guest items, fetch the user's existing cart before navigating
        // specially if going to checkout
        if (target.includes("checkout")) {
          dispatch(fetchCart({ userId: user._id })).then(() => {
            sessionStorage.removeItem("redirectPath");
            navigate(target, { replace: true });
          });
        } else {
          sessionStorage.removeItem("redirectPath");
          navigate(target, { replace: true });
        }
      }
    }
  }, [user, guestId, cart, navigate, from, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(googleLogin({ accessToken: tokenResponse.access_token, action: "login" }));
    },
    onError: () => toast.error("Google Login Failed"),
    ux_mode: "redirect",
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff6200]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center mb-4">
              <img src={logo} alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-orange-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4">
              <Zap size={11} className="fill-orange-400" />
              Anuveshana Technologies
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white text-center">
              Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">Back</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 text-center">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-white text-sm outline-none placeholder:text-slate-600 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" title="Forgot Password" className="text-[10px] sm:text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-widest transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-white text-sm outline-none placeholder:text-slate-600 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-2.5 text-sm text-center">
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing In...</>
              ) : (
                <><span>Sign In</span><ArrowRight size={16} /></>
              )}
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#111620] px-2 text-slate-500 font-bold tracking-widest leading-none">Or continue with</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full bg-white/5 hover:bg-white/10 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-3"
            >
              <FcGoogle size={20} />
              <span>Google</span>
            </motion.button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-xs sm:text-sm">
            Don't have an account?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(from)}`} className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
