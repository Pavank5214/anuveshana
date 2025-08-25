import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// Update the image to one that represents your technology
import featuredPrint from "../../assets/hero.jpg";

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-gray-50 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Left Content */}
        <div className="lg:w-1/2 p-8 md:p-12 text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base font-semibold text-[#ff6200] uppercase tracking-wide mb-3"
          >
            Advanced Manufacturing
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-900"
          >
            From Digital Design to <br className="hidden md:block" /> Physical Reality 🚀
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-base md:text-lg mb-8"
          >
            We utilize state-of-the-art 3D printing technology to turn your complex designs into high-precision parts with unmatched speed and quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/portfolio"
              className="inline-block bg-[#ff6200] hover:bg-[#e55a00] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              Explore Our Work
            </Link>
          </motion.div>
        </div>

        {/* Right Content - Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:w-1/2 w-full"
        >
          <img
            src={featuredPrint}
            alt="High-precision 3D printer in operation"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturedCollection;