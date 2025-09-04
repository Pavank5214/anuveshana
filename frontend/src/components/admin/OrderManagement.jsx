import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

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

  const toggleExpand = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-500">
      <h2 className="text-3xl font-bold mb-6 text-white">Order Management</h2>

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
              <>
                {/* Main Row */}
                <tr key={order._id} className='border-b hover:bg-gray-50 transition cursor-pointer'>
                  <td className="py-3 px-4 font-medium text-gray-900" onClick={() => toggleExpand(order._id)}>
                    #{order._id}
                  </td>
                  <td className="py-3 px-4 text-gray-900">{order.user?.name || "No User"}</td>
                  <td className="py-3 px-4 text-gray-900">₹{order.totalPrice}</td>
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

              {/* Expanded Details Row */}
{expandedOrderIds.includes(order._id) && (
  <tr className="bg-gray-50">
    <td colSpan="5" className="p-4">
      {/* Shipping Info */}
      <p><strong>Shipping:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}, {order.shippingAddress?.postalCode}</p>
      <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
      <p><strong>Email:</strong> {order.email}</p>

      {/* Payment Info */}
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Payment Status:</strong> {order.isPaid ? "Paid" : "Unpaid"}</p>
      {order.paymentDetails?.razorpay_payment_id && (
        <p><strong>Payment ID:</strong> {order.paymentDetails.razorpay_payment_id}</p>
      )}

      {/* Order Date & Time */}
      <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      {/* Products */}
      <div className="mt-2">
        <strong>Products:</strong>
        <ul className="ml-4">
          {order.orderItems.map((item, idx) => (
            <li key={idx}>
              {item.name} - ₹{item.price} x {item.quantity} (Size : {item.size || "N/A"}, TextColor : {item.textColor || "N/A"} , BaseColor : {item.baseColor || "N/A"})
            </li>
          ))}
        </ul>
      </div>
    </td>
  </tr>
)}

              </>
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
