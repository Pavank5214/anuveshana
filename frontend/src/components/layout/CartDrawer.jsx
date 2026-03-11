import { IoMdClose } from "react-icons/io";
import CartContent from "../cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const cartItemCount = cart?.products?.reduce((t, p) => t + p.quantity, 0) || 0;

  const handleCheckout = () => {
    toggleCartDrawer();
    navigate(!user ? "/login?redirect=checkout" : "/checkout");
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop — blur + dim */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleCartDrawer}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Popup — top-right, below navbar */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.92, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -12 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ transformOrigin: "top right" }}
            className="fixed top-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[22rem] max-h-[80vh] flex flex-col
              bg-[#0D1120]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingCart size={17} className="text-orange-400" />
                <h2 className="text-sm font-black tracking-tight text-white">Your Cart</h2>
                {cartItemCount > 0 && (
                  <span className="min-w-[18px] h-[18px] bg-[#ff6200] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <button
                onClick={toggleCartDrawer}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <IoMdClose className="h-4 w-4 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Cart Items (scrollable) */}
            <div className="flex-1 overflow-y-auto p-3 scrollbar-hide min-h-0">
              {cart && cart?.products?.length > 0 ? (
                <CartContent cart={cart} userId={userId} guestId={guestId} />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Your cart is empty</p>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { toggleCartDrawer(); navigate("/collections/all"); }}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Browse products →
                  </motion.button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart && cart?.products?.length > 0 && (
              <div className="px-4 py-3.5 border-t border-white/10 bg-[#0B0F19]/80">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400 text-xs uppercase tracking-widest">Subtotal</span>
                  <span className="text-white font-black text-lg">
                    ₹{cart.totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <span>Checkout</span>
                  <ArrowRight size={15} />
                </motion.button>
                <p className="text-slate-600 text-[10px] text-center mt-2">
                  Taxes & shipping at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
