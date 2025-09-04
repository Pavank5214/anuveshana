import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users = [], loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === "admin") dispatch(fetchUsers());
  }, [dispatch, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addUser(formData));
    dispatch(fetchUsers());
    setFormData({ name: "", email: "", password: "", role: "customer" });
  };

  const handleRoleChange = (userId, newRole) => {
    const currentUser = users.find((u) => u._id === userId);
    dispatch(updateUser({
      id: userId,
      name: currentUser.name,
      email: currentUser.email,
      role: newRole,
    })).then(() => dispatch(fetchUsers()));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId)).then(() => dispatch(fetchUsers()));
    }
  };

  // Count totals for summary cards
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalCustomers = users.filter(u => u.role === "customer").length;

  return (
    <div className="min-h-screen p-6 bg-gray-500">
      <h2 className="text-3xl font-bold mb-6 text-white">User Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl shadow-md bg-blue-100">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="p-6 rounded-xl shadow-md bg-green-100">
          <h3 className="text-lg font-semibold text-gray-700">Admins</h3>
          <p className="text-2xl font-bold text-gray-900">{totalAdmins}</p>
        </div>
        <div className="p-6 rounded-xl shadow-md bg-yellow-100">
          <h3 className="text-lg font-semibold text-gray-700">Customers</h3>
          <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Add User Card */}
      <div className="p-6 mb-8 bg-gray-100 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
            Add User
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-gray-50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100 transition cursor-pointer">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 font-medium">{user.email}</td>
                  <td className="py-3 px-4 font-medium">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500 font-medium">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
