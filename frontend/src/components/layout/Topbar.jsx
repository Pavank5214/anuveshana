import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#ff4d4d] via-[#ff1e56] to-[#ea2e0e] text-white shadow-md">

      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        {/* Left Social Links */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:scale-125 transition-transform duration-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="https://www.instagram.com/anubis__3d/" className="hover:scale-125 transition-transform duration-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:scale-125 transition-transform duration-300">
            <RiTwitterXLine className="h-5 w-5" />
          </a>
        </div>

        {/* Center Text */}
        <div className="text-sm text-center flex-grow font-medium">
          🚀Precision 3D Printing & Prototyping Services
        </div>

        {/* Right Contact */}
        <div className="hidden md:block">
          <a
            href="tel:+919380400291"
            className="hover:text-gray-200 transition"
          >
            📞 +91 89518 52210
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
