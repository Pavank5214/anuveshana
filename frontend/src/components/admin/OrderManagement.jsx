import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  }

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-500">
      <h2 className="text-3xl font-bold mb-6 text-white">Order Management</h2>

      {/* Table container */}
      <div className="overflow-x-auto shadow-md rounded-xl bg-white border border-gray-200">
        <table className='min-w-full text-left text-gray-600'>
          <thead className='bg-gray-100 text-gray-700 text-sm uppercase'>
            <tr>
              <th className="py-3 px-4">Order Id</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map((order) => (
              <tr key={order._id} className='border-b hover:bg-gray-50 transition cursor-pointer'>
                <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">#{order._id}</td>
                <td className="py-3 px-4 text-gray-900">{order.user?.name || "No User"}</td>
                <td className="py-3 px-4 text-gray-900">${order.totalPrice}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleStatusChange(order._id, "Delivered")}
                    className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition'
                  >
                    Mark as Delivered
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500 font-medium">
                  No Orders Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;
