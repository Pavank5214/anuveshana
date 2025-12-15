import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { Instagram, MessageSquare, Phone, Mail, MapPin } from "lucide-react";
import logo from '../../assets/logo.png'; // Make sure the path to your logo is correct

const Footer = () => {
  return (
    <footer className="bg-[#0a1a2f] text-gray-300 pt-20 pb-8">
      {/* Top Section */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6">

        {/* Column 1: Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Anuveshana Logo" className="h-12 w-auto" />
            <span className="text-xl font-bold text-white">Anuveshana Technologies</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Your partner in precision 3D printing and advanced manufacturing, turning digital designs into physical reality.
          </p>
        </motion.div>

        {/* Column 2: Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </motion.div>

        {/* Column 3: Our Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
          <ul className="space-y-3">
            <li><a href="/#services" className="hover:text-white transition-colors">Rapid Prototyping</a></li>
            <li><a href="/#services" className="hover:text-white transition-colors">Precision 3D Printing</a></li>
            <li><a href="/#services" className="hover:text-white transition-colors">Custom Manufacturing</a></li>
            <li><Link to="/#upload" className="hover:text-white transition-colors">Get a Quote</Link></li>
          </ul>
        </motion.div>

        {/* Column 4: Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 flex-shrink-0" />
              <span> Banglore, Karnataka-560070</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-1 flex-shrink-0" />
              <a href="tel:+918951852210" className="hover:text-white transition-colors">+91 89518 52210</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-1 flex-shrink-0" />
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=anuveshanatechnologies@gmail.com&su=Business%20Inquiry&body=Hello%20Anuveshana%20Team," className="hover:text-white transition-colors">anuveshanatechnologies@gmail.com</a>
            </li>
          </ul>
          <div className="flex items-center space-x-4 mt-6">
  <a
    href="https://www.instagram.com/anubis__3d/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="hover:text-white hover:scale-110 transition-transform"
  >
    <Instagram className="w-6 h-6" />
  </a>

  <a
    href="https://wa.me/918951852210"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp"
    className="hover:text-white hover:scale-110 transition-transform"
  >
    <FaWhatsapp className="w-6 h-6" />
  </a>
</div>

        </motion.div>

      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-16 px-6 border-t border-gray-700 pt-8">
        <p className="text-gray-400 text-sm text-center">
          © {new Date().getFullYear()} Anuveshana Technologies. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;