import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Cuboid, Bot, BrainCircuit } from "lucide-react";
import aboutus from "../../assets/aboutus.jpg";
import { useEffect, useState } from "react";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 py-16 md:py-24 flex flex-col items-center animate-pulse">
        {/* Hero Skeleton */}
        <div className="max-w-3xl w-full px-4 mt-20 mb-12 text-center space-y-4">
          <div className="h-12 sm:h-16 w-3/4 mx-auto bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg animate-shimmer" />
          <div className="h-6 sm:h-8 w-full mx-auto bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg animate-shimmer" />
        </div>
  
        {/* Mission Skeleton */}
        <div className="container mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-md mb-12">
          <div className="space-y-4">
            <div className="h-6 w-1/4 bg-gray-300 rounded animate-shimmer" />
            <div className="h-10 w-3/4 bg-gray-300 rounded animate-shimmer" />
            <div className="h-48 w-full bg-gray-300 rounded animate-shimmer" />
          </div>
          <div className="h-64 w-full bg-gray-300 rounded-2xl animate-shimmer" />
        </div>
  
        {/* Technology Skeleton */}
        <div className="container mx-auto px-4 py-12 md:py-20 text-center bg-white rounded-lg shadow-md mb-12 space-y-8">
          <div className="h-10 w-1/3 mx-auto bg-gray-300 rounded animate-shimmer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="p-6 rounded-lg flex flex-col items-center text-center border border-gray-200">
                <div className="h-8 w-8 bg-gray-300 rounded-full mb-3 animate-shimmer" />
                <div className="h-5 w-3/4 bg-gray-300 rounded mb-2 animate-shimmer" />
                <div className="h-10 w-full bg-gray-300 rounded animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
  
        {/* CTA Skeleton */}
        <div className="container mx-auto px-4 py-12 md:py-20 text-center bg-gray-800 text-white rounded-lg shadow-md space-y-4">
          <div className="h-10 w-1/2 mx-auto bg-gray-300 rounded animate-shimmer" />
          <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded animate-shimmer" />
          <div className="h-12 w-40 mx-auto bg-gray-300 rounded animate-shimmer" />
        </div>
  
        {/* Shimmer animation style */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -500px 0; }
            100% { background-position: 500px 0; }
          }
          .animate-shimmer {
            background: linear-gradient(90deg, #e2e8f0 25%, #f8fafc 50%, #e2e8f0 75%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear;
          }
        `}</style>
      </main>
    );
  }
  

  const technologies = [
    { icon: <Cuboid size={32} />, name: "FDM (Fused Deposition Modeling)", description: "Rapid prototyping using thermoplastic filaments." },
    { icon: <Bot size={32} />, name: "SLA (Stereolithography)", description: "High-detail models using photopolymer resins." },
    { icon: <BrainCircuit size={32} />, name: "SLS (Selective Laser Sintering)", description: "Functional parts from nylon powder for complex designs." },
  ];

  return (
    <main className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 mt-16 mb-12">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 mt-20">
            About Anuveshana Technologies
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
            Pioneering the future of manufacturing with precision, passion, and innovation.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white rounded-lg shadow-md mb-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center text-[#ff6200] mb-4">
            <Target size={24} className="mr-2 sm:mr-3" />
            <h3 className="text-lg sm:text-xl font-semibold">Our Mission</h3>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Democratizing Advanced Manufacturing
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Our mission is to empower innovators—from individual creators to enterprises—by providing accessible, high-precision 3D printing services. We bridge the gap between digital design and physical reality, helping bring ideas to life efficiently.  
            <br /><br />
            We believe that innovation should have no limits. By combining cutting-edge technologies with a deep understanding of materials and design, we enable prototyping, testing, and production with unparalleled accuracy.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center items-center"
        >
          <motion.img
            src={aboutus}
            alt="About Us"
            className="rounded-2xl shadow-lg max-w-full h-auto object-cover w-full md:w-auto"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </section>

      {/* Technology Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center mb-12 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
          Our Technology
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-200 p-6 sm:p-8 rounded-lg flex flex-col items-center text-center"
            >
              <div className="text-[#ff6200] inline-block bg-orange-100 p-3 rounded-full mb-3">
                {tech.icon}
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2">{tech.name}</h4>
              <p className="text-gray-600 text-sm sm:text-base">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center bg-gray-800 text-white rounded-lg shadow-md mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Have a Project in Mind?</h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
          Let's turn your concept into a reality. Get a free, no-obligation quote today.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/contact"
            className="inline-block bg-[#ff6200] hover:bg-[#e55a00] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Project
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default AboutPage;
