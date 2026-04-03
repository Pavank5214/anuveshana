import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import featuredPrint from "../../assets/hero.jpg";

const FeaturedCollection = () => {
  const features = [
    "50-micron Layer Resolution",
    "Industrial Grade Materials",
    "24-Hour Rapid Turnaround"
  ];

  return (
    <section className="py-24 px-4 bg-[#0B0F19] relative overflow-hidden">
      
      {/* --- Global Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[128px] -translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto max-w-6xl relative z-10"
      >
        <div className="flex flex-col-reverse lg:flex-row items-stretch bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Left Content */}
          <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-center lg:text-left relative">
            {/* Decorative Top Highlight */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent lg:hidden" />

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-bold tracking-widest uppercase mb-6 self-center lg:self-start">
                <Zap size={14} className="fill-orange-400" />
                <span>Advanced Manufacturing</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white">
                From Digital Design to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  Physical Reality.
                </span>
              </h2>

              <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
                We utilize state-of-the-art 3D printing technology to turn your complex designs into high-precision parts.  Whether it's a single prototype or a production run, we deliver with unmatched speed and quality.
              </p>

              {/* Feature List */}
              <div className="flex flex-col gap-3 mb-10 items-center lg:items-start">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 font-medium">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 bg-[#ff6200] hover:bg-[#e55a00] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105"
              >
                <span>Explore Our Work</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Image */}
          <div className="lg:w-1/2 relative overflow-hidden min-h-[300px] lg:min-h-full group">
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <motion.img
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src={featuredPrint}
              alt="High-precision 3D printer in operation"
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay Gradient for Text Readability if needed, or style */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 lg:opacity-30" />
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedCollection;