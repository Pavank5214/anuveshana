import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchAdminOrderDetails, updateOrderStatus } from "../../redux/slices/adminOrderSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Calendar,
    User,
    Truck,
    MapPin,
    CreditCard,
    ChevronLeft,
    CheckCircle2,
    Smartphone,
    ExternalLink,
    Printer,
    Layers,
    Save,
    MessageSquare,
    Mail,
    Clock,
    ShieldCheck,
    RefreshCcw,
    Box,
    AlertCircle,
    Loader2,
    ArrowRight,
    ChevronDown
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
    }),
};

const AdminOrderDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedOrder, loading, error } = useSelector((state) => state.adminOrders);

    const [localStatus, setLocalStatus] = useState("");
    const [trackingId, setTrackingId] = useState("");
    const [trackingUrl, setTrackingUrl] = useState("");
    const [courier, setCourier] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [associatedTickets, setAssociatedTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);

    useEffect(() => {
        dispatch(fetchAdminOrderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedOrder) {
            setLocalStatus(selectedOrder.status);
            setTrackingId(selectedOrder.trackingId || "");
            setTrackingUrl(selectedOrder.trackingUrl || "");
            setCourier(selectedOrder.courier || "");

            // Fetch associated tickets
            const orderRef = selectedOrder.orderId || id;
            setLoadingTickets(true);
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets?orderId=${orderRef}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            }).then(res => {
                setAssociatedTickets(res.data.tickets || []);
            }).finally(() => setLoadingTickets(false));
        }
    }, [selectedOrder, id]);

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        dispatch(updateOrderStatus({ id, status: localStatus, trackingId, trackingUrl, courier }))
            .then((res) => {
                setIsUpdating(false);
                if (res.meta.requestStatus === "fulfilled") {
                    toast.success("Order updated successfully");
                    dispatch(fetchAdminOrderDetails(id));
                } else {
                    toast.error("Failed to update order");
                }
            });
    };

    if (loading && !selectedOrder) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
                <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl text-center max-w-md">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
                    <p className="text-red-400 font-bold mb-4">{error}</p>
                    <button onClick={() => navigate("/admin/orders")} className="px-6 py-2 bg-white/5 text-white rounded-xl text-xs font-bold uppercase">Back to List</button>
                </div>
            </div>
        );
    }

    if (!selectedOrder) return null;

    const statusMap = { "Placed": 0, "Processing": 1, "Printing": 2, "Shipped": 3, "Delivered": 4, "Cancelled": -1 };
    const activeStepIndex = statusMap[selectedOrder.status] ?? 0;

    const steps = [
        { label: "Placed", icon: Package, completed: activeStepIndex >= 0 },
        { label: "Processing", icon: Clock, completed: activeStepIndex >= 1 },
        { label: "Printing", icon: Layers, completed: activeStepIndex >= 2 },
        { label: "Shipped", icon: Truck, completed: activeStepIndex >= 3 },
        { label: "Delivered", icon: CheckCircle2, completed: activeStepIndex >= 4 },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
            {/* Background glow */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 text-left">
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                        <Link to="/admin/orders" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 group w-fit">
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Back to List</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                <Package size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">Order Details</h1>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                                    Order ID: #{selectedOrder.orderId || selectedOrder._id.slice(-8).toUpperCase()}
                                    {selectedOrder.isNew && (
                                        <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded font-black tracking-tighter animate-pulse shadow-lg shadow-red-600/20">NEW</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
                        className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                    >
                        <Printer size={16} /> Print Order Info
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Order Status Timeline */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="bg-[#121620] border border-white/[0.06] rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-8 relative z-10">
                                <Truck size={14} className="text-orange-500" />
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Order Status</h3>
                            </div>
                            <div className="flex justify-between items-center relative py-4 px-2">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-3 relative z-10 w-full group">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-700 ${idx === activeStepIndex ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20' : (step.completed ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-[#0B0F19] border-white/5 text-slate-800')}`}>
                                            <step.icon size={16} />
                                        </div>
                                        <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center ${idx <= activeStepIndex ? 'text-white' : 'text-slate-800'}`}>{step.label}</span>
                                        {idx < steps.length - 1 && (
                                            <div className="absolute top-5 left-[60%] w-[80%] h-[1.5px] bg-white/5 -z-10 rounded-full overflow-hidden">
                                                <div className={`h-full bg-orange-500/30 transition-all duration-1000 ${step.completed ? 'w-full' : 'w-0'}`} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* List of Products */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="bg-[#121620] border border-white/[0.06] rounded-[2rem] overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers size={14} className="text-orange-500" />
                                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Items List</h3>
                                </div>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{selectedOrder.orderItems.length} Products</span>
                            </div>
                            <div className="p-6 sm:p-8 space-y-8">
                                {selectedOrder.orderItems.map((item, idx) => (
                                    <div key={idx} className="group/item border-b border-white/[0.04] last:border-0 pb-8 last:pb-0">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            {/* Product Image & Info */}
                                            <div className="flex flex-1 gap-6">
                                                <div className="w-20 h-24 sm:w-24 sm:h-32 rounded-2xl bg-[#0B0F19] border border-white/10 overflow-hidden shrink-0 group-hover/item:border-orange-500/30 transition-colors shadow-2xl">
                                                    <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover/item:scale-105 transition-transform duration-500" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-black text-white uppercase tracking-tight group-hover/item:text-orange-400 transition-colors mb-2">{item.name}</h4>
                                                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        <span className="bg-white/5 border border-white/[0.06] px-2.5 py-1 rounded-md">Qty: {item.quantity}</span>
                                                        <span className="bg-white/5 border border-white/[0.06] px-2.5 py-1 rounded-md text-orange-500/80">{item.size || 'Default Size'}</span>
                                                    </div>

                                                    {/* Customization Details Box */}
                                                    {(item.custName || (item.personalization && Object.keys(item.personalization).length > 0)) && (
                                                        <div className="mt-4 p-4 rounded-xl bg-white/[0.015] border border-white/[0.04] space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1 h-3 bg-orange-500 rounded-full" />
                                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Personalization Details</p>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                                                {item.custName && (
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Customer Name</span>
                                                                        <span className="text-blue-400 text-[11px] font-black italic">"{item.custName}"</span>
                                                                    </div>
                                                                )}
                                                                {item.personalization && Object.entries(item.personalization instanceof Map ? Object.fromEntries(item.personalization) : item.personalization).map(([key, val]) => (
                                                                    <div key={key} className="flex flex-col gap-1">
                                                                        <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">{key}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            {val && typeof val === 'string' && val.startsWith('#') && (
                                                                                <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: val }} />
                                                                            )}
                                                                            <span className="text-slate-300 text-[10px] font-black uppercase tracking-tight">
                                                                                {val}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pricing Section (Right Aligned on Desktop) */}
                                            <div className="flex sm:flex-col justify-between items-end sm:justify-start gap-1 min-w-[120px] pt-1">
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-white tracking-tighter leading-none">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    <p className="text-[9px] font-bold text-slate-700 tracking-widest uppercase mt-1">₹{item.price} / unit</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-8 bg-white/[0.02] border-t border-white/[0.04] flex justify-between items-center text-left">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Total Bill</h4>
                                    <p className="text-3xl font-black text-white tracking-tighter italic">₹{selectedOrder.totalPrice.toLocaleString()}</p>
                                </div>
                                <StatusBadge status={selectedOrder.isPaid ? 'Paid' : 'Unpaid'} paid={selectedOrder.isPaid} />
                            </div>
                        </motion.div>

                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8 text-left">

                        {/* Update Order Panel */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/[0.03] blur-[60px] rounded-full pointer-events-none" />
                            <div className="flex items-center gap-2 mb-8">
                                <Save size={14} className="text-orange-500" />
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Update Order</h3>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Current Status</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3.5 text-[11px] font-black text-white uppercase tracking-widest outline-none focus:border-orange-500 appearance-none cursor-pointer"
                                            value={localStatus}
                                            onChange={(e) => setLocalStatus(e.target.value)}
                                        >
                                            <option value="Placed">Placed</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Printing">Printing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Courier Service</label>
                                        <input
                                            type="text" placeholder="e.g. BlueDart"
                                            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white uppercase outline-none focus:border-orange-500 placeholder:text-slate-800"
                                            value={courier} onChange={(e) => setCourier(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Tracking ID</label>
                                        <input
                                            type="text" placeholder="Enter ID"
                                            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white uppercase outline-none focus:border-orange-500 placeholder:text-slate-800"
                                            value={trackingId} onChange={(e) => setTrackingId(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Tracking Link</label>
                                        <input
                                            type="text" placeholder="https://..."
                                            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-medium text-slate-400 outline-none focus:border-orange-500 placeholder:text-slate-800"
                                            value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 group/btn
                                        ${isUpdating
                                            ? "bg-orange-500/50 cursor-not-allowed text-white/50"
                                            : "bg-orange-500 text-white shadow-orange-500/10 hover:bg-orange-400 active:scale-[0.98]"}`}
                                >
                                    {isUpdating ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <RefreshCcw size={14} className="group-hover/btn:rotate-180 duration-500" />
                                    )}
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </motion.div>

                        {/* Customer Info */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="bg-[#121620] border border-orange-500/20 rounded-[2.5rem] p-6 sm:p-8 space-y-4 shadow-xl shadow-orange-500/5">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-orange-500" />
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Customer Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Full Name</p>
                                    <p className="text-sm font-black text-white hover:text-orange-400 transition-colors uppercase">{selectedOrder.user?.name || `${selectedOrder.shippingAddress?.firstName} ${selectedOrder.shippingAddress?.lastName}`}</p>
                                </div>
                                <div className="pt-3 border-t border-white/[0.04]">
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Account Email</p>
                                    <div className="flex items-center gap-2">
                                        <Mail size={12} className="text-slate-600" />
                                        <p className="text-[11px] font-bold text-slate-300 font-mono italic">{selectedOrder.user?.email || selectedOrder.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Associated Support Tickets */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4.5} className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-6 sm:p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={14} className="text-[#ff6200]" />
                                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Support Activity</h3>
                                </div>
                                {associatedTickets.length > 0 && (
                                    <span className="bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black">{associatedTickets.length}</span>
                                )}
                            </div>

                            <div className="space-y-3">
                                {loadingTickets ? (
                                    <div className="py-4 flex justify-center"><Loader2 size={16} className="animate-spin text-slate-800" /></div>
                                ) : associatedTickets.length > 0 ? (
                                    associatedTickets.map(ticket => (
                                        <Link
                                            key={ticket._id}
                                            to="/admin/tickets"
                                            onClick={() => {
                                                // Ideally we'd set the selected ticket in redux and navigate, 
                                                // for now just go to management
                                            }}
                                            className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-[10px] font-bold text-white uppercase truncate pr-4">{ticket.subject}</p>
                                                <span className={`text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${ticket.status === 'Open' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-400'}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">#{ticket.ticketId || ticket._id.slice(-6).toUpperCase()}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="py-2 text-center">
                                        <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest italic">No tickets for this order</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Shipping Info */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-6 sm:p-8 space-y-6">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-orange-500" />
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Shipping Address</h3>
                            </div>
                            {selectedOrder.shippingAddress ? (
                                <div className="space-y-1.5">
                                    <p className="text-base font-black text-white leading-tight uppercase tracking-tight">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic opacity-80">
                                        {selectedOrder.shippingAddress.address}<br />
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                                        {selectedOrder.shippingAddress.pincode}, {selectedOrder.shippingAddress.country}
                                    </p>
                                    <div className="flex items-center gap-2 pt-4 border-t border-white/[0.04] mt-4">
                                        <Smartphone size={12} className="text-slate-700" />
                                        <span className="text-[10px] font-bold text-slate-500 tracking-wider">+91 {selectedOrder.shippingAddress.phone}</span>
                                    </div>
                                </div>
                            ) : <p className="text-xs text-slate-800 italic">No address found</p>}
                        </motion.div>

                        {/* Payment Info */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-6 sm:p-8 space-y-6">
                            <div className="flex items-center gap-2">
                                <CreditCard size={14} className="text-orange-500" />
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Payment Info</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1 opacity-60">Payment Method</p>
                                    <p className="text-xs font-black text-white hover:text-orange-400 transition-colors uppercase truncate">{selectedOrder.paymentMethod || 'Razorpay'}</p>
                                </div>
                                {selectedOrder.paymentDetails?.razorpay_payment_id && (
                                    <div className="pt-4 border-t border-white/[0.04]">
                                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1 opacity-60">Payment ID</p>
                                        <p className="text-[10px] font-bold text-slate-300 font-mono tracking-tighter truncate">{selectedOrder.paymentDetails.razorpay_payment_id}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>

                </div>

                {/* Bottom Info */}
                <div className="mt-12 flex flex-center justify-center gap-8 mb-8 pb-8">
                    <div className="flex items-center gap-2 text-slate-800">
                        <ShieldCheck size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Verified Order</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800">
                        <RefreshCcw size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Latest Data</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Sub-components
const StatusBadge = ({ status, paid }) => {
    if (paid !== undefined) {
        return (
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${paid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                {status}
            </span>
        );
    }
    const styles = {
        Placed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Processing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        Printing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        Shipped: "bg-blue-400/10 text-blue-400 border-blue-400/20",
        Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${styles[status]}`}>
            {status}
        </span>
    );
};

export default AdminOrderDetailsPage;
