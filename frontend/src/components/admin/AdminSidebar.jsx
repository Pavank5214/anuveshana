import React from 'react';
import {
  FaUser,
  FaBoxOpen,
  FaClipboardList,
  FaStore,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from "react-router-dom";
import{logout}  from "../../redux/slices/authSlice";
import {clearCart} from "../../redux/slices/cartSlice"

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Logout should clear token/session and redirect
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/"); // Redirect to home
    
  };

  // ✅ Centralized styles for active/inactive links
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-2 py-3 px-4 rounded transition-all duration-200 ${
      isActive
        ? "bg-gray-700 text-white shadow-md"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <aside className="p-6 bg-gray-900 h-screen w-64 shadow-lg flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="mb-6 text-center">
          <Link to="/admin" className="text-2xl font-semibold text-white tracking-wide">
            Anuveshana
          </Link>
        </div>

        <h2 className="text-lg font-medium mb-6 text-center text-gray-400">
          Admin Dashboard
        </h2>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2" role="navigation" aria-label="Admin Sidebar">
          <NavLink to="/admin" end className={linkClasses}>
            <FaHome />
            <span>Home</span>
          </NavLink>

          <NavLink to="/admin/users" className={linkClasses}>
            <FaUser />
            <span>Users</span>
          </NavLink>

          <NavLink to="/admin/products" className={linkClasses}>
            <FaBoxOpen />
            <span>Products</span>
          </NavLink>

          <NavLink to="/admin/orders" className={linkClasses}>
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>

          <NavLink to="/" className={linkClasses}>
            <FaStore />
            <span>Shop</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition duration-200"
          aria-label="Logout"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
