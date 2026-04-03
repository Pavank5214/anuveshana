import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Key, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`, { email });
            toast.success("OTP sent to your email");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`, { email, otp });
            setStep(3);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password`, { email, otp, newPassword });
            toast.success("Password reset successfully");
            setStep(4);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    const variants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 py-8 sm:py-16">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff6200]/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
                    <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <Link to="/" className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                            <img src={logo} alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white text-center">
                            Reset <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">Password</span>
                        </h1>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form key="step1" {...variants} onSubmit={handleSendOTP} className="space-y-4">
                                <p className="text-slate-400 text-sm text-center mb-4">Enter your email and we'll send you an OTP code.</p>
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
                                <button type="submit" disabled={loading} className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send OTP <ArrowRight size={16} /></>}
                                </button>
                                <Link to="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-white text-sm transition-colors mt-4">
                                    <ArrowLeft size={14} /> Back to Login
                                </Link>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form key="step2" {...variants} onSubmit={handleVerifyOTP} className="space-y-4">
                                <p className="text-slate-400 text-sm text-center mb-4">We've sent a 6-digit code to <b>{email}</b></p>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">OTP Code</label>
                                    <div className="relative">
                                        <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-white text-sm font-mono tracking-[0.5em] outline-none placeholder:text-slate-600 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify Code <ArrowRight size={16} /></>}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 hover:text-white text-sm transition-colors mt-2">
                                    Use a different email
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form key="step3" {...variants} onSubmit={handleResetPassword} className="space-y-4">
                                <p className="text-slate-400 text-sm text-center mb-4">OTP Verified. Set your new password below.</p>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            minLength={6}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-white text-sm outline-none placeholder:text-slate-600 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Reset Password <CheckCircle2 size={16} /></>}
                                </button>
                            </motion.form>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" {...variants} className="text-center space-y-6 py-4">
                                <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 size={40} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Success!</h3>
                                    <p className="text-slate-400 text-sm">Your password has been reset successfully. You can now log in with your new password.</p>
                                </div>
                                <button onClick={() => navigate("/login")} className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-all">
                                    Go to Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
