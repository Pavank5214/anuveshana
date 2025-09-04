import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

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

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>

            {productsLoading || ordersLoading ? (
                <p className="text-gray-500 dark:text-gray-300">Loading...</p>
            ) : productsError ? (
                <p className="text-red-500">{productsError}</p>
            ) : ordersError ? (
                <p className="text-red-500">{ordersError}</p>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg rounded-xl flex flex-col justify-between">
                            <h2 className="text-lg font-medium">Revenue</h2>
                            <p className="text-3xl font-bold mt-2">₹{totalSales || 0}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg rounded-xl flex flex-col justify-between">
                            <h2 className="text-lg font-medium">Total Orders</h2>
                            <p className="text-3xl font-bold mt-2">{totalOrders || 0}</p>
                            <Link
                                to="/admin/orders"
                                className="mt-4 text-sm font-medium underline hover:text-gray-200"
                            >
                                Manage Orders
                            </Link>
                        </div>
                        <div className="p-6 bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg rounded-xl flex flex-col justify-between">
                            <h2 className="text-lg font-medium">Total Products</h2>
                            <p className="text-3xl font-bold mt-2">{products?.length || 0}</p>
                            <Link
                                to="/admin/products"
                                className="mt-4 text-sm font-medium underline hover:text-gray-200"
                            >
                                Manage Products
                            </Link>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Orders</h2>
                        <div className="overflow-x-auto rounded-lg shadow-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-sm">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Order Id</th>
                                        <th className="py-3 px-4 text-left">User</th>
                                        <th className="py-3 px-4 text-left">Total Price</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                                    {orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr
                                                key={order._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                            >
                                                <td className="py-3 px-4">{order._id}</td>
                                                <td className="py-3 px-4">{order.user?.name || "Guest"}</td>
                                                <td className="py-3 px-4">₹{order.totalPrice}</td>
                                                <td className={`py-3 px-4 font-medium ${
                                                    order.status === "Delivered"
                                                        ? "text-green-600"
                                                        : order.status === "Pending"
                                                        ? "text-yellow-500"
                                                        : "text-red-500"
                                                }`}>
                                                    {order.status}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                                                No recent orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminHomePage;
