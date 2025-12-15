import { useEffect, useState } from "react";
import { IoLogoInstagram } from "react-icons/io";

const Topbar = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#ff4d4d] via-[#ff1e56] to-[#ea2e0e] text-white shadow-md
      transition-transform duration-300
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <div className="hidden md:flex">
          <a
            href="https://www.instagram.com/anubis__3d/"
            className="hover:scale-125 transition"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </a>
        </div>

        <div className="text-sm text-center flex-grow font-medium ">
          🚀 Precision 3D Printing & Prototyping Services
        </div>

        <div className="hidden md:block">
          📞 +91 89518 52210
        </div>
      </div>
    </div>
  );
};

export default Topbar;
