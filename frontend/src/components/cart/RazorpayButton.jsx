import React from "react";
import logo from "../../assets/logo.png";

const RazorpayButton = ({ amount, onSuccess, onError, name, email, phone }) => {
  const handlePayment = async () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: amount * 100, // in paise
      currency: "INR",
      name: "Anuveshana Technologies",
      description: "Order Payment",
      // image: logo, // Removed to prevent CORS issues with localhost in dev
      handler: function (response) {
        onSuccess(response);
      },
      prefill: {
        name: name || "Customer",
        email: email || "test@example.com",
        contact: phone || "9999999999",
      },
      notes: {
        address: "Shipping Address",
      },
      theme: {
        color: "#ff6200",
      },
      modal: {
        ondismiss: function () {
          onError("Payment cancelled");
        },
      },
    };

    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white font-black py-4 rounded-3xl shadow-xl shadow-orange-500/20 transition-all uppercase tracking-widest text-sm"
    >
      Pay Now ₹{amount?.toLocaleString()}
    </button>
  );
};

export default RazorpayButton;
