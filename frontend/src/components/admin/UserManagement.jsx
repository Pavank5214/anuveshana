import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../redux/slices/adminSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Trash2,
  MoreVertical,
  Search,
  ChevronRight,
  UserCog,
  Shield,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

// Simple Stat Card
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay}>
    <div className="relative overflow-hidden bg-[#121620] border border-white/[0.06] rounded-2xl p-4 sm:p-5 group hover:border-white/10 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 ${color}`} />
      <div className="relative z-10 flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 border border-white/[0.06]`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { users = [], loading, error } = useSelector((state) => state.admin);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") navigate("/");
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser?.role === "admin") dispatch(fetchUsers());
  }, [dispatch, currentUser]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(addUser(formData));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User added");
      dispatch(fetchUsers());
      setFormData({ name: "", email: "", password: "", role: "customer" });
      setIsAddingUser(false);
    } else {
      toast.error("Error adding user");
    }
  };

  const handleRoleChange = (userId, newRole) => {
    const targetUser = users.find((u) => u._id === userId);
    dispatch(updateUser({
      id: userId,
      name: targetUser.name,
      email: targetUser.email,
      role: newRole,
    })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success(`Role changed to ${newRole}`);
        dispatch(fetchUsers());
      } else {
        toast.error("Error updating role");
      }
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("User removed");
          dispatch(fetchUsers());
        } else {
          toast.error("Error deleting user");
        }
      });
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsersCount = users.length;
  const totalAdminsCount = users.filter(u => u.role === "admin").length;
  const totalCustomersCount = users.filter(u => u.role === "customer").length;

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8 text-left">
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
            <Users className="text-orange-500" size={24} />
            User Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest opacity-60">Manage your store users</p>
        </motion.div>

        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddingUser(!isAddingUser)}
          className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg
            ${isAddingUser ? 'bg-white/10 text-white border border-white/10' : 'bg-[#ff6200] text-white shadow-orange-500/20 shadow-xl'}`}
        >
          {isAddingUser ? <Plus className="rotate-45" size={16} /> : <UserPlus size={16} />}
          <span>{isAddingUser ? "Cancel" : "Add New User"}</span>
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Users} label="Total People" value={totalUsersCount} color="bg-blue-500" delay={1} />
        <StatCard icon={ShieldCheck} label="Admins" value={totalAdminsCount} color="bg-orange-500" delay={2} />
        <StatCard icon={User} label="Customers" value={totalCustomersCount} color="bg-emerald-500" delay={3} />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6 text-center">
          <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
        </motion.div>
      )}

      {/* Add User Form */}
      <AnimatePresence>
        {isAddingUser && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#121620] border border-white/[0.08] rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.03] blur-[60px] rounded-full pointer-events-none" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Plus size={14} className="text-orange-500" /> New User Profile
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative group">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Full Name" required
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-800 outline-none focus:border-orange-500 transition-all font-bold"
                  />
                </div>
                <div className="relative group">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="Email Address" required
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-800 outline-none focus:border-orange-500 transition-all font-bold"
                  />
                </div>
                <div className="relative group">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="Password" required
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-800 outline-none focus:border-orange-500 transition-all font-bold"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-400 transition-colors" />
                    <select
                      name="role" value={formData.role} onChange={handleChange}
                      className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-orange-500 appearance-none transition-all cursor-pointer"
                    >
                      <option value="customer" className="bg-[#121620]">Customer</option>
                      <option value="admin" className="bg-[#121620]">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-[#ff6200] hover:bg-[#e55a00] text-white px-6 rounded-xl transition-all shadow-xl shadow-orange-500/20 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Table Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
        <div className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
          {/* Toolbar */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <UserCog size={14} className="text-orange-500" />
              <h2 className="text-[10px] font-black text-white uppercase tracking-widest">All Users</h2>
            </div>

            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[10px] text-white placeholder:text-slate-800 outline-none focus:border-orange-500/50 transition-all font-bold"
              />
            </div>
          </div>

          {loading && !users.length ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin text-orange-500 mx-auto mb-4" size={28} />
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Loading List...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.01]">
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-600">User Details</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-600">Role</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 text-left">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border ${user.role === 'admin' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-lg shadow-orange-500/5' : 'bg-[#0B0F19] text-slate-500 border-white/5'}`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-black text-white uppercase tracking-tight">{user.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-transparent outline-none transition-all cursor-pointer shadow-sm
                              ${user.role === 'admin' ? 'border-orange-500/30 text-orange-400' : 'border-white/10 text-slate-500 hover:border-white/20'}`}
                          >
                            <option value="customer" className="bg-[#121620]">Customer</option>
                            <option value="admin" className="bg-[#121620]">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="w-9 h-9 rounded-xl text-slate-700 hover:text-red-500 bg-white/5 hover:bg-red-500/10 border border-white/5 flex items-center justify-center transition-all shadow-sm"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-white/[0.04]">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="p-5 flex items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border border-white/5 ${user.role === 'admin' ? 'bg-orange-500/10 text-orange-400' : 'bg-[#0B0F19] text-slate-500'}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate uppercase tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-600 truncate font-bold">{user.email}</p>
                        <div className="mt-1.5">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border bg-transparent outline-none
                              ${user.role === 'admin' ? 'border-orange-500/30 text-orange-400' : 'border-white/10 text-slate-700'}`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 active:text-red-500 bg-white/5 active:bg-red-500/10 rounded-xl border border-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={28} className="text-slate-800" />
              </div>
              <h3 className="text-white text-xs font-black uppercase tracking-widest mb-1">No one found</h3>
              <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Try a different search</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserManagement;
