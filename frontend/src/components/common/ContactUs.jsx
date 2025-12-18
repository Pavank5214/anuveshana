import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Zap, Globe } from "lucide-react";
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (success) {
      setFormData({ name: "", email: "", number: "", message: "" });
      const timer = setTimeout(() => dispatch(resetContactState()), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createContact(formData));
  };

  const contactInfo = [
    { icon: <MapPin />, title: "HQ Location", text: "Bangalore, KA 560070" },
    { icon: <Phone />, title: "24/7 Support", text: "+91 89518 52210", href: "tel:+918951852210" },
    { icon: <Mail />, title: "Email Us", text: "anuveshana@gmail.com", href: "mailto:anuveshanatechnologies@gmail.com" },
    { icon: <Clock />, title: "Work Hours", text: "Mon-Sat: 9AM-6PM" },
  ];

  return (
    <main className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-[#0B0F19] text-white selection:bg-orange-500/30 mt-5">
      
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
              <Globe size={14} />
              <span>Global Reach</span>
            </div> */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Let's Build the <br />
              <span className="text-orange-500">Future.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We turn complex challenges into elegant digital solutions. 
              Reach out today to start your transformation.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Side: Contact Cards */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300"
              >
                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex items-center gap-5">
                  <div className="p-3 bg-slate-800 rounded-lg text-orange-500 group-hover:text-white group-hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-black/20">
                    {React.cloneElement(item.icon, { size: 20 })}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{item.title}</h4>
                    {item.href ? (
                      <a href={item.href} className="text-lg font-semibold text-slate-200 hover:text-orange-400 transition-colors">
                        {item.text}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-slate-200">{item.text}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl relative"
          >
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Your Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 border border-slate-800 focus:border-orange-500/50 px-5 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-600"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 border border-slate-800 focus:border-orange-500/50 px-5 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-600"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <input
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-slate-800 focus:border-orange-500/50 px-5 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-600"
                  placeholder="+91 99999 99999"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full bg-black/40 border border-slate-800 focus:border-orange-500/50 px-5 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-600 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-5 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={18} className="fill-white" />
                    <span className="tracking-wide">SEND MESSAGE</span>
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 font-medium text-sm mt-4">
                      <span>✓ Message sent successfully! We will contact you soon.</span>
                    </div>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 font-medium text-sm mt-4">
                      <span>✕ {error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;