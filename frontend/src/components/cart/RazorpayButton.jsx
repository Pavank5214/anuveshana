import React from "react";

const RazorpayButton = ({ amount, onSuccess, onError }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Check your connection.");
      return;
    }

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Add your Razorpay key in .env
        amount: Math.round(amount * 100), // Amount in paise
        currency: "INR",
        name: "Anuveshana Technologies",
        description: "Order Payment",
        handler: function (response) {
          onSuccess(response);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        onError(response.error);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      onError(err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
    >
      Pay ₹{amount.toLocaleString()}
    </button>
  );
};

export default RazorpayButton;
