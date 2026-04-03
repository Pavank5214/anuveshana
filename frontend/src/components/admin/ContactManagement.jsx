import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/slices/contactSlice";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Search,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  Inbox
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: "easeOut" },
  }),
};

// Simple Stat Card
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay}>
    <div className="relative overflow-hidden bg-[#121620] border border-white/[0.06] rounded-2xl p-4 group hover:border-white/10 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 ${color}`} />
      <div className="relative z-10 flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 border border-white/[0.06]`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-xl font-black text-white tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const ContactManagement = () => {
  const dispatch = useDispatch();
  const { contacts = [], loading, error } = useSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const newMessagesCount = contacts.filter(c => {
    const today = new Date().toDateString();
    return new Date(c.createdAt).toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8 text-left">
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-600/[0.02] blur-[150px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Inbox className="text-emerald-500" size={24} />
            Customer Messages
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest opacity-60">Read and manage messages</p>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={MessageSquare} label="Total Messages" value={contacts.length} color="bg-blue-500" delay={1} />
        <StatCard icon={TrendingUp} label="New Messages" value={newMessagesCount} color="bg-emerald-500" delay={2} />
        <StatCard icon={CheckCircle2} label="All Tasks" value={contacts.length} color="bg-orange-500" delay={3} />
      </div>

      {/* Messages List Area */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-emerald-500" />
            <h2 className="text-[10px] font-bold text-white uppercase tracking-widest">All Messages</h2>
          </div>
        </div>

        {loading && !contacts.length ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={28} />
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Syncing List...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-red-500/5">
            <AlertCircle size={32} className="text-red-500/30 mx-auto mb-4" />
            <p className="text-red-400 text-xs font-medium">{error}</p>
          </div>
        ) : contacts.length > 0 ? (
          <>
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/[0.04]">
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Contact Info</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Message</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="group hover:bg-white/[0.02] transition-colors cursor-default">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black text-slate-500 group-hover:text-emerald-400">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-black text-white tracking-widest uppercase">{contact.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Mail size={10} className="text-slate-700" /> {contact.email}</p>
                          {contact.number && <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Phone size={10} className="text-slate-700" /> {contact.number}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] font-medium text-slate-500 truncate max-w-xs italic line-clamp-1">"{contact.message}"</p>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight size={14} className="text-slate-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card List */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {contacts.map((contact) => (
                <div key={contact._id} className="p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[12px] font-black text-emerald-400">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-white tracking-widest uppercase">{contact.name}</h3>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{new Date(contact.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-700">
                      <Mail size={14} />
                    </div>
                  </div>
                  <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/[0.03]">
                    <p className="text-[11px] font-medium text-slate-400 italic leading-relaxed">"{contact.message}"</p>
                  </div>
                  <div className="flex items-center gap-6 pt-1">
                    <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest truncate">{contact.email}</span>
                    {contact.number && <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">{contact.number}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-20 text-center">
            <Mail size={32} className="text-slate-800 mx-auto mb-4" />
            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-1">No Messages</h3>
            <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Your inbox is empty</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactManagement;
