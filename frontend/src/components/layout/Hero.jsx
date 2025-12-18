import { useEffect } from "react";
import videoBg from "../../assets/video2.mp4";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Zap } from "lucide-react";

const Hero = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0B0F19]">
      {/* Background Video - Shifted up 15% */}
      <div className="absolute inset-0 z-0 -translate-y-[15%]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient Overlay for seamless blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0B0F19]" />
      </div>

      {/* Hero Content - Shifted up 15% */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-7xl mx-auto -translate-y-[15%]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white max-w-5xl flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-2xl">
            <Zap size={14} className="fill-orange-400" />
            <span>Next Gen Manufacturing</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[1.1] tracking-tighter mb-6 text-white">
            Precision 3D <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">
              Printing Solutions
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Delivering innovative 3D printing for rapid prototyping and production across industries. High quality, fast turnarounds.
          </p>

          {/* Button Container */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Primary Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/upload"
                className="group flex items-center gap-2 bg-[#ff6200] hover:bg-[#e55a00] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-orange-500/25 transition-all duration-300"
              >
                <span>Get a Quote</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Secondary "Shop Now" Button */}
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/collections/all"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Shop Now
            </Link>
          </motion.div> */}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Moved up to 15% from bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-10 text-slate-400 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-widest opacity-70">Scroll</span>
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;