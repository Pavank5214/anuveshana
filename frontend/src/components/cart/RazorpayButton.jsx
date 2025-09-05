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
      image: logo,
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
        color: "#000000",
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
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg"
    >
      Pay Now ₹{amount?.toLocaleString()}
    </button>
  );
};

export default RazorpayButton;
