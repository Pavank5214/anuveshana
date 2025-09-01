import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createContact, resetContactState } from "../../redux/slices/contactSlice";

function ContactPage() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contacts);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createContact(formData));
  };

  useEffect(() => {
    if (success) {
      alert("Your message has been sent successfully!");
      setFormData({ name: "", email: "", number: "", message: "" });
      dispatch(resetContactState());
    }
  }, [success, dispatch]);

  const contactInfo = [
    { icon: <MapPin size={20} />, text: "APMC Yard, Vijayapura, Karnataka, 586101" },
    { icon: <Phone size={20} />, text: "+91 89518 52210", href: "tel:+918951852210" },
    { icon: <Mail size={20} />, text: "contact@anuveshana.tech", href: "mailto:contact@anuveshana.tech" },
    { icon: <Clock size={20} />, text: "Mon - Sat, 9:00 AM - 6:00 PM" },
  ];

  return (
    <main className="bg-gray-200 mt-20 min-h-screen">
      {/* Header */}
      <section className="py-16 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">
          Get In Touch
        </h1>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Have a question or project in mind? Reach out to us and let's collaborate.
        </p>
      </section>

      {/* Form & Contact Info */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-10 lg:grid-cols-2 items-start max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-10 rounded-2xl shadow-xl order-1 lg:order-1"
          >
            <h2 className="text-3xl font-bold text-orange-600 mb-6">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition"
                required
              />
              <input
                name="number"
                placeholder="Phone Number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && <p className="text-green-600 mt-2">Message sent successfully!</p>}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-10 rounded-2xl shadow-xl order-2 lg:order-2"
          >
            <h2 className="text-3xl font-bold text-orange-600 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6 text-gray-700">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="text-orange-500 mt-1 mr-4 flex-shrink-0">{item.icon}</div>
                  {item.href ? (
                    <a href={item.href} className="hover:text-orange-600 transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <p>{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[50vh]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.464197364132!2d75.7481139152885!3d16.82773418852366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc6555555555555%3A0x2614b8c9a6a89c9a!2sAPMC%20Yard%2C%20Vijayapura%2C%20Karnataka%20586101!5e0!3m2!1sen!2sin!4v1661421890123!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Anuveshana Technologies Location"
        ></iframe>
      </section>
    </main>
  );
}

export default ContactPage;
