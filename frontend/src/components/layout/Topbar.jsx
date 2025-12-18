import { useEffect, useState } from "react";
import { Instagram, Phone } from "lucide-react";

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
      className={`fixed top-0 left-0 w-full z-[60] transition-transform duration-300 ease-in-out h-10
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Background & Borders */}
      <div className="absolute inset-0 bg-[#02040a] border-b border-white/5">
         {/* Center Glowing Line Effect */}
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 md:w-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70" />
      </div>

      <div className="container relative mx-auto flex justify-between items-center px-4 md:px-8 h-full text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-400">
        
        {/* Left: Social Link */}
        <div className="hidden md:flex items-center">
          <a
            href="https://www.instagram.com/anubis__3d/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors duration-300"
          >
            <Instagram size={13} className="text-orange-500" />
            <span className="opacity-80 hover:opacity-100">@anubis__3d</span>
          </a>
        </div>

        {/* Center: Live Status / Tagline */}
        <div className="flex-grow flex justify-center items-center gap-3">
            {/* Pulsing Dot Animation */}
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            
            <span className="text-slate-300">
              Precision <span className="text-white">Prototyping</span> & Manufacturing
            </span>
        </div>

        {/* Right: Phone Number */}
        <div className="hidden md:flex items-center">
           <a href="tel:+918951852210" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone size={13} className="text-orange-500" />
            <span>+91 89518 52210</span>
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default Topbar;