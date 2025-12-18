import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Phone, Mail, MapPin, ChevronRight, Send } from "lucide-react";
import logo from '../../assets/logo.png'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#02040a] text-slate-400 pt-20 pb-10 overflow-hidden font-sans">
      
      {/* --- Top Glowing Separator --- */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-sm opacity-50" />

      {/* --- Background Ambient Light (Distinct from main page) --- */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* --- Column 1: Brand & Newsletter (Span 4) --- */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Anuveshana" className="h-10 w-auto" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-white uppercase tracking-tight">Anuveshana</span>
                <span className="text-[10px] font-bold text-orange-500 tracking-[0.3em] uppercase">Technologies</span>
              </div>
            </Link>
            <p className="text-slate-500 leading-relaxed text-sm pr-4">
              Your trusted partner in industrial 3D printing. We bridge the gap between complex digital geometries and durable physical parts.
            </p>
            
            {/* Newsletter Mini-Form */}
            {/* <div className="pt-4">
              <h4 className="text-white text-sm font-bold mb-3">Stay Updated</h4>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1 focus-within:border-orange-500/50 transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-none text-white text-sm px-3 w-full focus:ring-0 placeholder:text-slate-600"
                />
                <button className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-md transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div> */}
          </div>

          {/* --- Column 2: Navigation (Span 2) --- */}
          <div className="lg:col-span-2 md:col-span-4">
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Portfolio", href: "/portfolio" },
               
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm hover:text-orange-500 transition-colors flex items-center gap-1 group">
                    <ChevronRight size={12} className="text-orange-500 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Column 3: Services (Span 3) --- */}
          <div className="lg:col-span-3 md:col-span-4">
            <h4 className="text-white font-bold mb-6">Solutions</h4>
            <ul className="space-y-3">
              {[
                { label: "FDM Printing", href: "/#services" },
                { label: "SLA / Resin", href: "/#services" },
                { label: "SLS Nylon", href: "/#services" },
                { label: "Rapid Prototyping", href: "/#services" },
                { label: "Instant Quote", href: "/upload", highlight: true },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.href} 
                    className={`text-sm flex items-center gap-1 group transition-colors ${link.highlight ? 'text-orange-400 hover:text-orange-300 font-medium' : 'hover:text-orange-500'}`}
                  >
                    {link.highlight && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1 animate-pulse" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Column 4: Contact Card (Span 3) --- */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <MapPin size={18} className="text-orange-500 mt-1 shrink-0" />
                  <span className="text-sm">Bangalore, Karnataka 560070</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Phone size={18} className="text-orange-500 shrink-0" />
                  <a href="tel:+918951852210" className="text-sm hover:text-white transition-colors">+91 89518 52210</a>
                </li>
                <li className="flex gap-3 items-center">
                  <Mail size={18} className="text-orange-500 shrink-0" />
                  <a href="mailto:anuveshanatechnologies@gmail.com" className="text-sm hover:text-white transition-colors break-all">anuveshanatechnologies@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* --- Footer Bottom Bar --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600 text-center md:text-left">
            © {currentYear} Anuveshana Technologies. All Rights Reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: <FaInstagram />, href: "https://www.instagram.com/anubis__3d/" },
              { icon: <FaWhatsapp />, href: "https://wa.me/918951852210" },
             
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-orange-600 hover:text-white transition-all text-slate-400"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;