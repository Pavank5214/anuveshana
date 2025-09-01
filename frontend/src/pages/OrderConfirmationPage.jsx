import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  // Clear the cart when the order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg mt-30">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-emerald-700 mb-6 sm:mb-8">
        🎉 Thank You for Your Order!
      </h1>

      {checkout && (
        <div className="p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Order ID:{" "}
                <span className="text-gray-600 break-all">{checkout._id}</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Order Date:{" "}
                {new Date(checkout.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-sm sm:text-base">
              <p className="text-emerald-600 font-semibold">
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Ordered Items
            </h3>
            <div className="divide-y">
              {checkout.checkoutItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-start sm:items-center py-4"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md shadow-md mr-0 sm:mr-4 mb-4 sm:mb-0"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">Name: {item.custName}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Text Color: {item.textColor}
                    </p>
                    <p className="text-sm text-gray-500">
                      Base Color: {item.baseColor}
                    </p>
                  </div>

                  {/* Price Details */}
                  <div className="mt-4 sm:mt-0 sm:ml-auto text-left sm:text-right">
                    <p className="text-sm sm:text-base text-gray-700">
                      Price: ₹{item.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800">
                      Total: ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="mt-6 sm:mt-8 text-right border-t pt-4">
              <h3 className="text-lg sm:text-2xl font-bold text-emerald-700">
                Grand Total: ₹
                {checkout.checkoutItems.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )}
              </h3>
            </div>
          </div>

          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Payment Info */}
            <div className="p-4 bg-gray-50 rounded-md border">
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-700">
                {checkout.paymentMethod || "PayPal"}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="p-4 bg-gray-50 rounded-md border">
              <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
              <p className="text-gray-700">{checkout.shippingAddress.address}</p>
              <p className="text-gray-700">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
