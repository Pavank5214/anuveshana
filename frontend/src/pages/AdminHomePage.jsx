import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { motion } from "framer-motion";
import {
    DollarSign,
    ShoppingCart,
    Package,
    TrendingUp,
    ArrowRight,
    Clock,
    User,
    ChevronRight,
} from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
    }),
};

// Stat card component
const StatCard = ({ icon: Icon, label, value, color, link, linkText, delay }) => (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay}>
        <div className={`relative overflow-hidden bg-[#121620] border border-white/[0.06] rounded-2xl p-4 sm:p-5 group hover:border-white/10 transition-all duration-300`}>
            {/* Subtle glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 ${color}`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-2.5 rounded-xl ${color} bg-opacity-10 border border-white/[0.06]`}>
                        <Icon size={18} className="text-white" />
                    </div>
                    {link && (
                        <Link to={link} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                            {linkText} <ChevronRight size={10} />
                        </Link>
                    )}
                </div>

                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</p>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</p>
            </div>
        </div>
    </motion.div>
);

// Status badge
const StatusBadge = ({ status }) => {
    const styles = {
        Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Processing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${styles[status] || "bg-white/5 text-slate-400 border-white/10"}`}>
            {status}
        </span>
    );
};

const AdminHomePage = () => {
    const dispatch = useDispatch();

    const {
        products,
        loading: productsLoading,
        error: productsError
    } = useSelector((state) => state.adminProducts);

    const {
        orders,
        totalOrders,
        totalSales,
        loading: ordersLoading,
        error: ordersError
    } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const isLoading = productsLoading || ordersLoading;
    const hasError = productsError || ordersError;

    return (
        <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8 text-left">
            {/* Background glow */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

            {/* Header */}
            <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="mb-6 sm:mb-8"
            >
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                    Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase font-bold tracking-widest opacity-60">How your store is doing</p>
            </motion.div>

            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-[#121620] border border-white/[0.06] rounded-2xl p-5 h-32 animate-pulse">
                            <div className="w-10 h-10 bg-white/5 rounded-xl mb-3" />
                            <div className="w-16 h-3 bg-white/5 rounded mb-2" />
                            <div className="w-24 h-6 bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
            ) : hasError ? (
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 text-center">
                    <p className="text-red-400 text-sm font-bold uppercase tracking-widest">{productsError || ordersError}</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
                        <StatCard
                            icon={DollarSign}
                            label="Total Sales"
                            value={`₹${(totalSales || 0).toLocaleString()}`}
                            color="bg-emerald-500"
                            delay={1}
                        />
                        <StatCard
                            icon={ShoppingCart}
                            label="All Orders"
                            value={totalOrders || 0}
                            color="bg-blue-500"
                            link="/admin/orders"
                            linkText="View"
                            delay={2}
                        />
                        <div className="col-span-2 lg:col-span-1">
                            <StatCard
                                icon={Package}
                                label="Products"
                                value={products?.length || 0}
                                color="bg-purple-500"
                                link="/admin/products"
                                linkText="Open List"
                                delay={3}
                            />
                        </div>
                    </div>

                    {/* Recent Orders Section */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                        <div className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
                            {/* Section Header */}
                            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06] bg-white/[0.01]">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-orange-400" />
                                    <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Latest Orders</h2>
                                </div>
                                <Link to="/admin/orders" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                                    Show All <ArrowRight size={10} />
                                </Link>
                            </div>

                            {orders.length > 0 ? (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden sm:block">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/[0.04]">
                                                    <th className="py-4 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Order ID</th>
                                                    <th className="py-4 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Customer</th>
                                                    <th className="py-4 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Amount</th>
                                                    <th className="py-4 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.04]">
                                                {orders.slice(0, 8).map((order) => (
                                                    <tr
                                                        key={order._id}
                                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                                    >
                                                        <td className="py-4 px-6 text-xs text-slate-400 font-mono tracking-widest uppercase">
                                                            #{order._id.slice(-6)}
                                                        </td>
                                                        <td className="py-4 px-6 uppercase tracking-tight">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                                    <User size={11} className="text-slate-500" />
                                                                </div>
                                                                <span className="text-[11px] text-slate-300 font-bold">{order.user?.name || "Guest User"}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-sm font-black text-white italic">₹{order.totalPrice?.toLocaleString()}</td>
                                                        <td className="py-4 px-6"><StatusBadge status={order.status} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card List */}
                                    <div className="sm:hidden divide-y divide-white/[0.04]">
                                        {orders.slice(0, 6).map((order) => (
                                            <div
                                                key={order._id}
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                className="px-4 py-4 flex items-center justify-between gap-3 active:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                                                        <User size={13} className="text-slate-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-black text-white truncate uppercase tracking-tight">{order.user?.name || "Guest"}</p>
                                                        <p className="text-[10px] text-slate-600 font-mono uppercase">#{order._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xs font-black text-white italic">₹{order.totalPrice?.toLocaleString()}</p>
                                                    <div className="mt-1"><StatusBadge status={order.status} /></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="p-16 text-center">
                                    <ShoppingCart size={24} className="text-slate-800 mx-auto mb-3" />
                                    <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest">No orders yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default AdminHomePage;
