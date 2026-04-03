import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle,
    Package,
    Truck,
    XCircle,
    MessageSquare,
    ChevronRight,
    ArrowLeft,
    Mail,
    Phone,
    Clock,
    Zap,
    CheckCircle2,
    AlertTriangle,
    BookOpen,
    Info,
    ShieldCheck
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { createTicket, fetchUserTickets, resetTicketState } from "../redux/slices/ticketSlice";
import { toast } from "sonner";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" }
    })
};

const OrderSupport = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderIdFromUrl = searchParams.get("orderId");
    const { orders } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);
    const { tickets, loading, success } = useSelector((state) => state.tickets);

    const [activeTab, setActiveTab] = useState("new");
    const [selectedOrderId, setSelectedOrderId] = useState(orderIdFromUrl || "");
    const [supportCategory, setSupportCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            if (orders.length === 0) dispatch(fetchUserOrders());
            dispatch(fetchUserTickets());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (success) {
            toast.success("Support ticket created!");
            setSupportCategory("");
            setSubject("");
            setMessage("");
            setActiveTab("history"); // Switch to history to see the new ticket
            dispatch(resetTicketState());
        }
    }, [success, dispatch]);

    const categories = [
        { id: "tracking", label: "Tracking & Delivery", icon: Truck },
        { id: "cancellation", label: "Order Cancellation", icon: XCircle },
        { id: "quality", label: "Product Quality/Damage", icon: AlertTriangle },
        { id: "payment", label: "Payment Issues", icon: Zap },
        { id: "other", label: "Other Technical Issue", icon: HelpCircle },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedOrderId && !orderIdFromUrl && supportCategory !== "other") {
            toast.error("Please provide an Order ID or select from history");
            return;
        }
        if (!supportCategory) {
            toast.error("Please select a support category");
            return;
        }

        dispatch(createTicket({
            orderId: selectedOrderId || orderIdFromUrl,
            category: supportCategory,
            subject: subject || categories.find(c => c.id === supportCategory)?.label,
            message: message
        }));
    };

    return (
        <div className="min-h-screen bg-[#06090F] text-slate-300 font-sans pb-32 pt-24 md:pt-32 relative selection:bg-[#ff6200]/30">

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#ff6200]/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Go Back
                    </button>

                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight italic">
                        Order <span className="text-[#ff6200]">Support Center</span>
                    </h1>
                    <p className="text-slate-500 text-sm max-w-xl">
                        Have an issue with your order or need help with our process? Everything you need is right here.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs */}
                        <div className="flex gap-2 sm:gap-4 mb-4 overflow-x-auto pb-2 scrollbar-none">
                            <button
                                onClick={() => setActiveTab("new")}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === "new" ? "bg-[#ff6200] text-white" : "bg-white/5 text-slate-500 hover:text-white"}`}
                            >
                                New Request
                            </button>
                            {user && (
                                <button
                                    onClick={() => setActiveTab("history")}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === "history" ? "bg-[#ff6200] text-white" : "bg-white/5 text-slate-500 hover:text-white"}`}
                                >
                                    My Tickets ({tickets.length})
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab("guide")}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === "guide" ? "bg-[#ff6200] text-white" : "bg-white/5 text-slate-500 hover:text-white"}`}
                            >
                                Help Guide
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === "new" ? (
                                <motion.div key="new" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                    {/* Step 1: Order Selection */}
                                    <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 sm:p-8 overflow-hidden relative shadow-2xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                <Package size={16} />
                                            </div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Select Your Order</h3>
                                        </div>

                                        {orderIdFromUrl ? (
                                            <div className="p-4 bg-white/[0.03] border border-[#ff6200]/20 rounded-2xl flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Applying help for</p>
                                                    <p className="text-white font-mono font-bold">#{orders.find(o => o._id === orderIdFromUrl)?.orderId || orderIdFromUrl}</p>
                                                </div>
                                                <CheckCircle2 size={24} className="text-emerald-400" />
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {user ? (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Recent Orders</label>
                                                        <select
                                                            value={selectedOrderId}
                                                            onChange={(e) => setSelectedOrderId(e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 px-5 py-4 rounded-xl text-white outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="">-- General Issue (No specific order) --</option>
                                                            {orders.slice(0, 10).map(order => (
                                                                <option key={order._id} value={order.orderId || order._id} className="bg-[#111620]">
                                                                    #{order.orderId || order._id.slice(-8).toUpperCase()} - {new Date(order.createdAt).toLocaleDateString()}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Order ID</label>
                                                        <input
                                                            type="text"
                                                            value={selectedOrderId}
                                                            onChange={(e) => setSelectedOrderId(e.target.value)}
                                                            placeholder="Paste your Order ID here..."
                                                            className="w-full bg-black/40 border border-white/10 px-5 py-4 rounded-xl text-white outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-700"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Step 2: Issue Category */}
                                    <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 sm:p-8 shadow-2xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                <HelpCircle size={16} />
                                            </div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">How can we help?</h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setSupportCategory(cat.id)}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${supportCategory === cat.id
                                                        ? "bg-[#ff6200] border-[#ff6200] text-white shadow-lg shadow-orange-500/20"
                                                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.04]"
                                                        }`}
                                                >
                                                    <cat.icon size={18} />
                                                    <span className="text-[10px] font-black uppercase tracking-wide">{cat.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 3: Message & Submit */}
                                    <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 sm:p-8 shadow-2xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                <MessageSquare size={16} />
                                            </div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Describe the issue</h3>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Short Summary</label>
                                                <input
                                                    type="text"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    placeholder="e.g. Broken item on arrival"
                                                    required
                                                    className="w-full bg-black/40 border border-white/10 px-5 py-4 rounded-xl text-white outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Details</label>
                                                <textarea
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Tell us more about the problem..."
                                                    rows={4}
                                                    required
                                                    className="w-full bg-black/40 border border-white/10 px-5 py-4 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-700 resize-none"
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={loading}
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <span>Submit Support Ticket</span>
                                                        <Zap size={16} className="fill-white" />
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    </div>
                                </motion.div>
                            ) : activeTab === "history" ? (
                                <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    {tickets.length > 0 ? (
                                        tickets.map((ticket) => (
                                            <div
                                                key={ticket._id}
                                                onClick={() => navigate(`/support/chat/${ticket._id}`)}
                                                className="group bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 hover:border-orange-500/40 cursor-pointer transition-all shadow-xl"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-orange-500' : ticket.status === 'In Progress' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                                                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">{ticket.subject}</h4>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">#{ticket.ticketId || ticket._id.slice(-6).toUpperCase()} • {ticket.category}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${ticket.status === 'Open' ? 'bg-orange-500/10 text-orange-500' : ticket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] text-slate-600 font-medium">
                                                    <span>Last Update: {new Date(ticket.lastMessageAt).toLocaleString()}</span>
                                                    <div className="flex items-center gap-1 text-orange-500 font-black uppercase tracking-widest group-hover:gap-2 transition-all">
                                                        Open Chat <ChevronRight size={10} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[2rem]">
                                            <HelpCircle size={40} className="text-slate-800 mx-auto mb-4" />
                                            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-1">No tickets yet</h3>
                                            <p className="text-xs text-slate-600">Need help? Create a new support request.</p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="guide" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                                    {/* Guiding Process */}
                                    <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 shadow-2xl">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                <BookOpen size={16} />
                                            </div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Our Fulfillment Process</h3>
                                        </div>

                                        <div className="space-y-8 relative before:absolute before:left-4 before:top-8 before:bottom-0 before:w-px before:bg-white/5">
                                            {[
                                                { title: "Design & Customization", desc: "Your text or design is prepared by our experts based on your order details.", icon: Zap },
                                                { title: "Print Queue & Preparation", desc: "The design is sliced and added to our high-precision custom 3D printers.", icon: Clock },
                                                { title: "3D Printing Phase", desc: "Once printing begins, your product starts taking shape layer by layer.", icon: Package, highlight: true },
                                                { title: "Finishing & Shipping", desc: "Products are cleaned, quality-checked, and shipped to your address.", icon: Truck }
                                            ].map((step, i) => (
                                                <div key={i} className="flex gap-6 relative ml-1">
                                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center z-10 ${step.highlight ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-600 border border-white/10'}`}>
                                                        <step.icon size={14} />
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-sm font-black uppercase tracking-tight mb-1 ${step.highlight ? 'text-white' : 'text-slate-300'}`}>{step.title}</h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                                                        {step.highlight && (
                                                            <div className="mt-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 flex items-center gap-3">
                                                                <AlertTriangle size={14} className="text-orange-500 shrink-0" />
                                                                <p className="text-[10px] font-bold text-orange-200 uppercase leading-normal">Note: Cancellation is not possible once printing begins.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* FAQs */}
                                    <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 shadow-2xl">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                <Info size={16} />
                                            </div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Frequently Asked Questions</h3>
                                        </div>

                                        <div className="grid gap-4">
                                            {[
                                                { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking ID via email and SMS. You can also view status in 'My Orders'." },
                                                { q: "What if it arrives damaged?", a: "Report it within 24 hours via 'New Request' with photos, and we'll send a replacement immediately." },
                                                { q: "Can I change my text after ordering?", a: "Only if the printing hasn't started yet! Contact us immediately via support chat." },
                                                { q: "How long is the shipping?", a: "3-5 days for major cities, and up to 7 days for regional areas after production." }
                                            ].map((faq, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                                    <p className="text-xs font-black text-white uppercase tracking-tight mb-2">{faq.q}</p>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-6">
                        {/* Policy Sidebar Widget */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2.5}
                            className="bg-[#111620]/80 backdrop-blur-xl border border-orange-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-3xl rounded-full" />
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-orange-500" />
                                Refund Policy
                            </h4>
                            <div className="space-y-4">
                                <p className="text-[11px] text-slate-300 leading-relaxed font-bold italic">
                                    "Once printing begins, no refunds can be issued."
                                </p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Custom 3D printing involves significant filament waste and time once the model enters production. Please ensure all details are correct.
                                </p>
                                <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-normal">
                                        Full refund only available within 2 hours of order placement.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                            className="bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2.5rem] p-8 shadow-xl"
                        >
                            <h4 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-6">Direct Channels</h4>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Call Support</p>
                                        <p className="text-sm font-bold text-white tracking-tight">+91 89518 52210</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Email Us</p>
                                        <p className="text-sm font-bold text-white tracking-tight">anuveshana@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Working Hours</p>
                                        <p className="text-sm font-bold text-white tracking-tight">Mon-Sat: 9AM - 6PM</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSupport;
