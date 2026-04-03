import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    MessageSquare,
    Clock,
    User,
    ChevronRight,
    ChevronLeft,
    RefreshCw,
    Shield,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Send,
    ExternalLink,
    Mail,
    ArrowLeft
} from "lucide-react";
import { fetchAdminTickets, updateTicketStatus, replyToTicket, setSelectedTicket } from "../../redux/slices/ticketSlice";
import { toast } from "sonner";

const TicketManagement = () => {
    const dispatch = useDispatch();
    const { tickets, page, pages, selectedTicket, loading } = useSelector((state) => state.tickets);

    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [adminReply, setAdminReply] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showChatOnMobile, setShowChatOnMobile] = useState(false);

    useEffect(() => {
        dispatch(fetchAdminTickets({ page: currentPage }));
    }, [dispatch, currentPage]);

    const getStatusStyles = (status) => {
        const styles = {
            "Open": "bg-orange-500/10 text-orange-500 border-orange-500/20",
            "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
            "Resolved": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            "Closed": "bg-red-500/10 text-red-400 border-red-500/20",
        };
        return styles[status] || "bg-white/5 text-slate-500 border-white/10";
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        dispatch(fetchAdminTickets({ page: currentPage })).finally(() => setIsRefreshing(false));
    };

    const handleUpdateStatus = (id, status) => {
        if (status === "Closed" || status === "Resolved") {
            const isClosing = status === "Closed";
            toast.message(`${isClosing ? 'Close' : 'Resolve'} Ticket?`, {
                description: isClosing
                    ? "This will permanently close the support request."
                    : "This will mark the issue as resolved and notify the user.",
                action: {
                    label: "Confirm",
                    onClick: () => {
                        dispatch(updateTicketStatus({ id, status }))
                            .unwrap()
                            .then(() => toast.success(`Ticket ${isClosing ? 'closed' : 'resolved'} successfully`))
                            .catch(() => toast.error("Failed to update ticket"));
                    },
                },
                cancel: {
                    label: "Cancel",
                    onClick: () => { }
                }
            });
            return;
        }

        dispatch(updateTicketStatus({ id, status }))
            .unwrap()
            .then(() => toast.success(`Ticket marked as ${status}`))
            .catch(() => toast.error("Failed to update status"));
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!adminReply.trim() || !selectedTicket) return;

        dispatch(replyToTicket({ id: selectedTicket._id, message: adminReply.trim() }))
            .unwrap()
            .then(() => {
                setAdminReply("");
                toast.success("Reply sent");
            })
            .catch(() => toast.error("Failed to send reply"));
    };

    const handleSelectTicket = (ticket) => {
        dispatch(setSelectedTicket(ticket));
        setShowChatOnMobile(true);
    };

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = filterStatus === "All" || t.status === filterStatus;
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t._id.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#06090F] text-slate-300 px-3 py-6 sm:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 ${showChatOnMobile ? "hidden lg:flex" : "flex"}`}>
                    <div>
                        <h1 className="text-2xl font-black text-white italic uppercase tracking-wider">
                            Support <span className="text-[#ff6200]">Tickets</span>
                        </h1>
                        <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Manage customer issues & chat</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleRefresh} className={`p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Tickets List */}
                    <div className={`lg:col-span-5 space-y-6 ${showChatOnMobile ? "hidden lg:block" : "block"}`}>
                        {/* Filters */}
                        <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 sm:p-4 flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by subject, name or ID..."
                                    className="w-full bg-black/40 border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-orange-500/30 transition-all placeholder:text-slate-700"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {["All", "Open", "In Progress", "Resolved", "Closed"].map(status => {
                                    const activeClass = status === "All" ? "bg-orange-500 text-white" : getStatusStyles(status).replace("bg-", "bg-opacity-100 bg-").replace("/10", "").replace("text-", "text-white text-"); // Hacky but works for solid colors
                                    
                                    // Let's use simpler logic for active states
                                    const styles = {
                                        "All": "bg-orange-500 text-white",
                                        "Open": "bg-orange-500 text-white",
                                        "In Progress": "bg-blue-500 text-white",
                                        "Resolved": "bg-emerald-500 text-white",
                                        "Closed": "bg-red-500 text-white",
                                    };

                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${filterStatus === status ? styles[status] : "bg-white/5 text-slate-500 hover:text-white"}`}
                                        >
                                            {status}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-3 h-[calc(100vh-350px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map(ticket => (
                                    <div
                                        key={ticket._id}
                                        onClick={() => handleSelectTicket(ticket)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedTicket?._id === ticket._id ? "bg-orange-500/10 border-orange-500/40 shadow-lg shadow-orange-500/5" : "bg-[#111620]/80 border-white/5 hover:border-white/20"}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-bold text-white truncate pr-2">{ticket.subject}</h4>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-y-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <div className="flex items-center gap-1 min-w-0">
                                                    <User size={10} className="shrink-0" /> <span className="truncate max-w-[80px]">{ticket.user?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Clock size={10} /> {new Date(ticket.lastMessageAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <span className="text-slate-700 shrink-0">#{ticket.ticketId || ticket._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">No tickets found</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page {currentPage} of {pages}</span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pages, p + 1))}
                                    disabled={currentPage === pages}
                                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className={`lg:col-span-7 ${showChatOnMobile ? "block" : "hidden lg:block"}`}>
                        {selectedTicket ? (
                            <div className="bg-[#111620]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] flex flex-col h-[75vh] lg:h-[75vh] overflow-hidden">
                                {/* Chat Header */}
                                <div className="p-4 lg:p-6 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            {/* Mobile Back Button */}
                                            <button
                                                onClick={() => setShowChatOnMobile(false)}
                                                className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all mr-1"
                                            >
                                                <ArrowLeft size={18} />
                                            </button>

                                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-[2px] shrink-0">
                                                <div className="w-full h-full bg-[#111620] rounded-[14px] flex items-center justify-center text-white font-black uppercase text-base lg:text-lg italic">
                                                    {selectedTicket.user?.name?.charAt(0) || '?'}
                                                </div>
                                            </div>
                                            <div className="space-y-0.5 lg:space-y-1 min-w-0">
                                                <h3 className="text-white font-bold text-sm lg:text-lg leading-tight uppercase tracking-tight truncate">{selectedTicket.subject}</h3>
                                                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                                                    <div className="flex items-center gap-1 lg:gap-1.5 text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                                                        <User size={10} className="text-orange-500" /> {selectedTicket.user?.name}
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-1 lg:gap-1.5 text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                                                        <Mail size={10} className="text-orange-500" /> {selectedTicket.user?.email}
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-[6px] text-[7px] lg:text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(selectedTicket.status)}`}>
                                                        {selectedTicket.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
                                            {selectedTicket.orderId && (
                                                <Link
                                                    to={`/admin/orders/${selectedTicket.orderId}`}
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg lg:rounded-xl bg-orange-600 text-white text-[8px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20"
                                                >
                                                    <span className="hidden sm:inline">Order</span> <ExternalLink size={12} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleUpdateStatus(selectedTicket._id, "Resolved")}
                                                className="p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                                                title="Mark as Resolved"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedTicket._id, "Closed")}
                                                className="p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                title="Close Ticket"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-3 lg:mt-4 flex items-center gap-2 lg:gap-3 text-[8px] lg:text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] bg-black/40 w-fit px-2.5 py-0.5 rounded-full border border-white/5">
                                        AH-{selectedTicket.ticketId || selectedTicket._id.slice(-6).toUpperCase()}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/5">
                                    {selectedTicket.messages.map((msg, idx) => {
                                        const isAdmin = msg.sender === "admin";
                                        return (
                                            <div key={idx} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                                <div className={`flex gap-3 max-w-[85%] ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isAdmin ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-500"}`}>
                                                        {isAdmin ? <Shield size={16} /> : <User size={16} />}
                                                    </div>
                                                    <div>
                                                        <div className={`p-3 rounded-2xl text-sm ${isAdmin ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-slate-200 rounded-tl-none border border-white/5"}`}>
                                                            {msg.message}
                                                        </div>
                                                        <p className={`text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1 ${isAdmin ? "text-right" : "text-left"}`}>
                                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Reply Input */}
                                <div className="p-4 bg-black/20 border-t border-white/5">
                                    <form onSubmit={handleSendReply} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={adminReply}
                                            onChange={(e) => setAdminReply(e.target.value)}
                                            placeholder="Type your response..."
                                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/30 transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!adminReply.trim()}
                                            className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all disabled:opacity-50"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-[#111620]/40 border border-white/5 border-dashed rounded-[2rem] p-12 text-center">
                                <MessageSquare size={48} className="text-slate-800 mb-4" />
                                <h3 className="text-white text-lg font-bold uppercase tracking-widest mb-2">Select a Ticket</h3>
                                <p className="text-xs text-slate-600 max-w-xs">Choose a ticket from the list on the left to view the conversation and respond.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketManagement;
