import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PaypalButton from "./PaypalButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "Paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center py-8 text-gray-600">Loading cart...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p className="text-center py-8 text-gray-600">Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tight">
      
      {/* Left Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-semibold uppercase mb-6 text-gray-900">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Details</h3>
          <div className="mb-5">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-3 bg-gray-100 border rounded-lg text-gray-700"
              disabled
            />
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-800">Delivery</h3>
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-1">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-1">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-1">Phone No</label>
            <input
              type="text"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="mt-8">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 transition-colors text-white font-semibold py-3 rounded-xl shadow-lg"
              >
                Continue to Payment
              </button>
            ) : (
              <div className="">
                <h3 className="text-lg mb-4 font-semibold">Pay with PayPal</h3>
                <PaypalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => alert("Payment failed. Try again.")}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-semibold mb-6">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-start justify-between py-4 border-b">
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 rounded-lg object-cover mr-4 shadow"
                />
                <div>
                  <h3 className="text-md font-medium">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Name: {product.custName}</p>
                  <p className="text-gray-500">TextColor: {product.textColor}</p>
                  <p className="text-gray-500">BaseColor: {product.baseColor}</p>
                </div>
              </div>
              <p className="text-xl font-semibold">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p className="font-medium">Subtotal</p>
          <p className="font-semibold">${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p className="font-medium">Shipping</p>
          <p className="font-semibold text-green-600">Free</p>
        </div>
        <div className="flex justify-between items-center text-xl mt-6 border-t pt-4">
          <p className="font-semibold">Total</p>
          <p className="font-bold text-gray-900">${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
