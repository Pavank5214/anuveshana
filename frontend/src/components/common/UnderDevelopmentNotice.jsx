import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const UnderDevelopmentNotice = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold mb-2">🚧 Section Under Development</h2>
        <p className="text-sm">
          The file upload feature is currently under development. 
          If you need assistance, please contact us via WhatsApp.
        </p>
      </div>
      <a
        href="https://wa.me/+918951852210" // replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
      >
        <FaWhatsapp /> Contact Us
      </a>
    </div>
  );
};

export default UnderDevelopmentNotice;
