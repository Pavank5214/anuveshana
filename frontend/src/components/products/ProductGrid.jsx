import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import ProductRatingStars from "../common/ProductRatingStars";

const ProductGrid = ({ products, loading, error }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl h-[400px] animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-400 text-lg bg-red-500/10 inline-block px-6 py-2 rounded-full border border-red-500/20">
        Error: {error}
      </p>
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6 lg:gap-8"
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={item}>
          <Link to={`/product/${product._id}`} className="group block h-full">
            <div className="relative h-full bg-[#121620] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#ff6200]/30 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col">

              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden w-full bg-[#0B0F19]">
                <motion.img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.altText || product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                {/* Badge */}
                {product.isFeatured && (
                  <span className="absolute top-4 left-4 bg-[#ff6200] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20 z-10">
                    Featured
                  </span>
                )}

                {/* Quick Action Button - Appears on Hover */}
                <div className="absolute top-4 right-4 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                  <button className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#ff6200] hover:text-white transition-colors shadow-lg">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow items-start justify-end relative z-20 -mt-12 group-hover:-mt-16 transition-all duration-500">
                {/* Frosted Glass Background for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-[#121620] to-transparent" />

                <div className="relative z-10 w-full">
                  <h3 className="text-sm sm:text-lg font-bold text-white leading-snug mb-1 group-hover:text-[#ff6200] transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-medium text-slate-200">₹{product.price}</span>
                      {product.discountPrice && (
                        <span className="text-xs sm:text-sm line-through text-slate-600">₹{product.discountPrice}</span>
                      )}
                    </div>

                    {/* Hidden 'View' Text/Icon that slides in */}
                    <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                      <span className="text-[#ff6200] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        View <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Reviews / Ratings */}
                  <ProductRatingStars productId={product._id} />

                  {/* Tags - Optional */}
                  {/* <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
                      {product.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] text-slate-400 border border-white/10 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                   </div> */}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;