import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading order details...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-600">
          Error: {error}
        </p>
      </div>
    );

  if (!orderDetails || Object.keys(orderDetails).length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600">
          No order details found.
        </p>
      </div>
    );

  const { shippingAddress } = orderDetails;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-30">
      {/* Page Title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-700">
        Order Details
      </h2>

      {/* Order Details Card */}
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Order ID: <span className="text-gray-600">#{orderDetails._id}</span>
            </h3>
            <p className="text-gray-500 text-sm">
              Placed on:{" "}
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <span className="font-medium text-gray-700 mb-1">
              Order Status:
            </span>
            <span
              className={`${
                orderDetails.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } px-3 py-1 rounded-full text-sm font-semibold`}
            >
              {orderDetails.status || "Processing"}
            </span>
          </div>
        </div>

        {/* Payment & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {/* Payment Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">
              Payment Info
            </h4>
            <p className="text-gray-600 text-sm">
              Method:{" "}
              <span className="font-medium">
                {orderDetails.paymentMethod || "N/A"}
              </span>
            </p>
            <p className="text-gray-600 text-sm">
              Status:{" "}
              <span
                className={`${
                  orderDetails.isPaid
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }`}
              >
                {orderDetails.isPaid ? "Paid" : "Unpaid"}
              </span>
            </p>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">
              Shipping Info
            </h4>
            <p className="text-gray-600 text-sm">
              Method:{" "}
              <span className="font-medium">
                {orderDetails.shippingMethod || "Standard"}
              </span>
            </p>
            <p className="text-gray-600 text-sm">
              Address:{" "}
              {shippingAddress
                ? `${shippingAddress.address || ""}, ${shippingAddress.city || ""}, ${shippingAddress.country || ""}`
                : "N/A"}
            </p>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">
              Delivery Estimate
            </h4>
            <p className="text-gray-600 text-sm">
              Expected by:{" "}
              <span className="font-medium">
                {new Date(
                  new Date(orderDetails.createdAt).setDate(
                    new Date(orderDetails.createdAt).getDate() + 10
                  )
                ).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-x-auto mb-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">
            Products Ordered
          </h4>
          <table className="min-w-full text-gray-700 bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-center">Unit Price</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems?.map((item) => (
                <tr
                  key={item.productId}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Product Name & Image */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.name}
                    </Link>
                  </td>

                  {/* Unit Price */}
                  <td className="py-3 px-4 text-center">
                    ₹{item.price.toFixed(2)}
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 text-center">{item.quantity}</td>

                  {/* Total */}
                  <td className="py-3 px-4 text-right font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="flex justify-end mb-6">
          <h3 className="text-xl font-bold text-emerald-700">
            Grand Total: ₹
            {orderDetails.orderItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ).toFixed(2)}
          </h3>
        </div>

        {/* Back to Orders Link */}
        <div className="flex justify-start">
          <Link
            to="/profile"
            className="inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
