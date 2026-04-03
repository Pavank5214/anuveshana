import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle,
    Package,
    ArrowLeft,
    Send,
    MessageSquare,
    Clock,
    User,
    Shield,
    CheckCircle2,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { fetchTicketDetails, replyToTicket } from "../../redux/slices/ticketSlice";
import { toast } from "sonner";

const TicketChat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    const { selectedTicket, loading } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    const [message, setMessage] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchTicketDetails(id));
        // Simple polling every 20 seconds
        const pollInterval = setInterval(() => {
            dispatch(fetchTicketDetails(id));
        }, 20000);
        return () => clearInterval(pollInterval);
    }, [dispatch, id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedTicket?.messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        dispatch(replyToTicket({ id, message: message.trim() }))
            .unwrap()
            .then(() => {
                setMessage("");
            })
            .catch((err) => {
                toast.error(err.message || "Failed to send message");
            });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        dispatch(fetchTicketDetails(id)).finally(() => setIsRefreshing(false));
    };

    if (!selectedTicket && loading) {
        return (
            <div className="min-h-screen bg-[#06090F] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#ff6200]/20 border-t-[#ff6200] rounded-full animate-spin" />
            </div>
        );
    }

    if (!selectedTicket) {
        return (
            <div className="min-h-screen bg-[#06090F] flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle size={48} className="text-slate-800 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Ticket Not Found</h2>
                <button onClick={() => navigate("/support/order")} className="text-[#ff6200] text-sm font-black uppercase tracking-widest hover:underline">
                    Back to Support
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#06090F] text-slate-300 font-sans pb-10 pt-24 md:pt-32 relative flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#ff6200]/[0.02] blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/support/order?active=history")} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-white truncate max-w-[200px] sm:max-w-md">{selectedTicket.subject}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${selectedTicket.status === 'Open' ? 'bg-orange-500/10 text-orange-500' : selectedTicket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {selectedTicket.status}
                                </span>
                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">#{selectedTicket.ticketId || selectedTicket._id.slice(-6).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleRefresh} className={`p-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
                        <RefreshCw size={16} />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-[#111620]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] flex flex-col overflow-hidden min-h-[500px] max-h-[70vh]">
                    {/* Chat Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                        {selectedTicket.messages.map((msg, idx) => {
                            const isMe = msg.sender === "user";
                            return (
                                <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`flex gap-3 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isMe ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-400"}`}>
                                            {isMe ? <User size={16} /> : <Shield size={16} />}
                                        </div>
                                        <div>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-orange-600 text-white rounded-tr-none shadow-lg shadow-orange-600/10" : "bg-white/5 text-slate-200 border border-white/5 rounded-tl-none"}`}>
                                                {msg.message}
                                            </div>
                                            <p className={`text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5 ${isMe ? "text-right" : "text-left"}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={selectedTicket.status === 'Closed' ? "This ticket is closed" : "Type your message here..."}
                                disabled={selectedTicket.status === 'Closed'}
                                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-700 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || selectedTicket.status === 'Closed'}
                                className="w-12 h-12 rounded-xl bg-[#ff6200] text-white flex items-center justify-center hover:bg-[#e65800] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="mt-4 flex flex-wrap gap-4 px-6">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Category: {selectedTicket.category}</span>
                    </div>
                    {selectedTicket.orderId && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Order: #{selectedTicket.orderId}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketChat;
