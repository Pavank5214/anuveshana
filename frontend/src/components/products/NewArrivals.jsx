import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);
  const scrollByAmount = 300;

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    const amount = direction === 'left' ? -scrollByAmount : scrollByAmount;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const atStart = container.scrollLeft <= 0;
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
      setCanScrollLeft(!atStart);
      setCanScrollRight(!atEnd);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    updateScrollButtons();
    
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [newArrivals]);


  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a1a2f] to-slate-800">
      <div className="container mx-auto text-center relative">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">
          ✨ Explore New Arrivals
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover the latest 3D parts and robotic projects freshly added to our collection.
        </p>

        {/* Arrow Buttons */}
        <div className="absolute right-4 top-0 hidden md:flex space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-3 rounded-full bg-gray-800/90 shadow-lg hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="text-xl text-gray-200" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-3 rounded-full bg-gray-800/90 shadow-lg hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="text-xl text-gray-200" />
          </button>
        </div>
      </div>

      {/* Scrollable Product List */}
      <div className="container mx-auto">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 py-4 scroll-smooth scrollbar-hide cursor-grab active:cursor-grabbing"
        >
          {newArrivals.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[23%] flex-shrink-0 relative rounded-2xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-lg border border-gray-700 group"
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Link to={`/products/${product._id}`} className="block">
                  <h3 className="font-semibold text-lg text-white truncate group-hover:text-[#ff6200] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-300">₹{product.price}</p>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;