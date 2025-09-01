import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <p className="text-center py-10 text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: index * 0.05, duration: 0.5 }}
        >
          <Link to={`/product/${product._id}`}>
            <div className="relative bg-white rounded-xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
              {/* Image */}
              <div className="relative w-full h-72 sm:h-80 overflow-hidden">
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.altText || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* View Details Icon on Hover */}
                <div className="absolute bottom-4 right-4 bg-white/90 text-gray-800 p-3 rounded-full translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>
                
                {/* Featured Badge */}
                {product.isFeatured && (
                  <span className="absolute top-3 left-3 bg-[#ff6200] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    Featured
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#ff6200] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-extrabold text-gray-900">₹{product.price}</p>
                    {product.discountPrice && (
                      <p className="text-sm line-through text-gray-400">₹{product.discountPrice}</p>
                    )}
                  </div>
                  {/* Color Squares */}
                  <div className="flex items-center gap-2 mt-3">
                    {product.colors?.slice(0, 4).map((color, idx) => (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.colors?.length > 4 && (
                      <span className="text-xs font-medium text-gray-500">+{product.colors.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Tags / Badges */}
                <div className="flex gap-2 mt-4 flex-wrap pt-4 border-t border-gray-100">
                  {product.tags?.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;