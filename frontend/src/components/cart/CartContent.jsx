import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../redux/slices/cartSlice";
import { motion } from "framer-motion";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (productId, delta, quantity, size, color) => {
    const newQty = quantity + delta;
    if (newQty >= 1) {
      dispatch(updateCartItemQuantity({ productId, quantity: newQty, guestId, userId, size, color }));
    }
  };

  const handleRemove = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div className="space-y-3">
      {cart.products.map((product, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
          className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
        >
          {/* Image */}
          <div className="shrink-0 w-20 h-24 rounded-xl overflow-hidden border border-white/10">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h3 className="text-white text-sm font-bold leading-snug truncate">{product.name}</h3>

              {/* Specs */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {product.custName && (
                  <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">
                    ✏ {product.custName}
                  </span>
                )}
                {product.size && (
                  <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">
                    {product.size}
                  </span>
                )}
                {product.textColor && (
                  <span className="flex items-center gap-1 text-[10px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block" style={{ backgroundColor: product.textColor.toLowerCase() }} />
                    Text
                  </span>
                )}
                {product.baseColor && (
                  <span className="flex items-center gap-1 text-[10px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block" style={{ backgroundColor: product.baseColor.toLowerCase() }} />
                    Base
                  </span>
                )}
              </div>
            </div>

            {/* Price + Qty + Delete */}
            <div className="flex items-center justify-between mt-2">
              <p className="text-white font-black text-base">
                ₹{(product.price * product.quantity).toLocaleString("en-IN")}
              </p>

              <div className="flex items-center gap-2">
                {/* Qty controls */}
                <div className="flex items-center border border-white/15 rounded-lg overflow-hidden bg-white/5 h-7">
                  <button
                    onClick={() => handleQtyChange(product.productId, -1, product.quantity, product.size, product.color)}
                    className="w-7 h-full flex items-center justify-center text-slate-400 hover:text-orange-400 active:text-orange-400 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-white text-xs font-bold select-none">{product.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(product.productId, 1, product.quantity, product.size, product.color)}
                    className="w-7 h-full flex items-center justify-center text-slate-400 hover:text-orange-400 active:text-orange-400 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleRemove(product.productId, product.size, product.color)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CartContent;
