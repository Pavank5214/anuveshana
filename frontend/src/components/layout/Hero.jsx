import React from "react";
import videoBg from "../../assets/video2.mp4";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full h-200">
    {/* Background Video */}
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
    >
      <source src={videoBg} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/70 z-[-1]" />

    {/* Hero Content */}
    <div className="relative h-full flex items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white max-w-4xl"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-md">
          Precision 3D Printing Solutions
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Delivering innovative 3D printing for rapid prototyping and production across industries. High quality, fast turnarounds.
        </p>

        {/* Button Container */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Primary Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/upload"
              className="inline-block bg-[#ff6200] hover:bg-[#e55a00] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get a Quote
            </Link>
          </motion.div>

          {/* Secondary "Shop Now" Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/collections/all"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

export default Hero;
