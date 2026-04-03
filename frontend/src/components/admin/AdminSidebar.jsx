import React, { useEffect } from 'react';
import {
  User,
  Package,
  ClipboardList,
  Store,
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { fetchNewOrdersCount } from "../../redux/slices/adminOrderSlice";

const AdminSidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { newOrdersCount } = useSelector((state) => state.adminOrders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchNewOrdersCount());

      // Auto-refresh every 2 minutes for sidebar bubble
      const interval = setInterval(() => {
        dispatch(fetchNewOrdersCount());
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    if (closeSidebar) closeSidebar();
    navigate("/");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 group ${isActive
      ? "bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/5 font-bold"
      : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, badge: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ClipboardList, badge: true },
    { to: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
    { to: "/blog", label: "Blog", icon: FileText },
    { to: "/admin/contacts", label: "Reach Outs", icon: Users },
    { to: "/admin/tickets", label: "Support Tickets", icon: MessageSquare },
  ];

  return (
    <aside className="p-5 bg-[#0D1117] h-screen w-64 flex flex-col justify-between">
      <div>
        {/* Brand/Logo Section */}
        <div className="mb-10 px-2 lg:px-4">
          <Link to="/admin" onClick={closeSidebar} className="flex flex-col text-left">
            <span className="text-xl font-black text-white uppercase tracking-tighter leading-none">
              Anuveshana
            </span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mt-1.5 opacity-80">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 text-left">Menu</p>
          <nav className="flex flex-col space-y-1.5" role="navigation" aria-label="Admin Sidebar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeSidebar}
                className={linkClasses}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={isActive ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300"} />
                      <span className="text-sm tracking-tight font-bold">{item.label}</span>
                      {item.badge && newOrdersCount > 0 && (
                        <span className="bg-red-600 text-white text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg shadow-red-600/20 animate-pulse border border-red-500/50">
                          {newOrdersCount}
                        </span>
                      )}
                    </div>
                    {isActive && <ChevronRight size={14} className="text-orange-500" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-8 px-4 border-t border-white/[0.04]" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 text-left">Links</p>
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-300 group"
          >
            <Store size={18} className="text-slate-500 group-hover:text-slate-300" />
            <span className="text-sm tracking-tight font-bold">Back to Store</span>
          </Link>
        </div>
      </div>

      {/* Logout Action Section */}
      <div className="pt-6 border-t border-white/[0.04]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-3.5 px-4 rounded-xl text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 font-black group"
          aria-label="Logout"
        >
          <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-xs tracking-widest uppercase">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
