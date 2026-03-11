import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import TextRating from "../common/TextRating";
import axiosInstance from "../../utils/axiosInstance";
import { ShoppingBag, Star, Truck, RotateCcw, ShieldCheck, ChevronRight, Zap, Minus, Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
  }),
};

const ProductDetails = ({ productId }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [productId]);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const { isCartOpen } = useSelector((state) => state.cart);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [selectedTextColor, setSelectedTextColor] = useState(null);
  const [selectedBaseColor, setSelectedBaseColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
      const fetchReviews = async () => {
        try {
          const { data } = await axiosInstance.get(`/api/reviews/${productFetchId}`);
          setAverageRating(data.averageRating || 0);
          setTotalReviews(data.reviews ? data.reviews.length : 0);
        } catch (e) { console.error("Failed to fetch reviews", e); }
      };
      fetchReviews();
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) setMainImage(selectedProduct.images[0].url);
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((p) => p + 1);
    if (action === "minus" && quantity > 1) setQuantity((p) => p - 1);
  };

  const handleAddToCart = () => {
    if (!customerName || !selectedTextColor || !selectedBaseColor || !selectedSize) {
      setShowErrors(true);
      const message = !customerName ? "Please enter Name"
        : !selectedTextColor ? "Please select Text Color"
          : !selectedBaseColor ? "Please select Base Color"
            : "Please select Size";
      toast.error(message, { duration: 1800 });
      return;
    }
    setShowErrors(false);
    setIsButtonDisabled(true);
    dispatch(addToCart({
      productId: productFetchId, quantity, size: selectedSize,
      custName: customerName, textColor: selectedTextColor,
      baseColor: selectedBaseColor, guestId, userId: user?._id,
    }))
      .then(() => toast.success("Added to cart!", { duration: 1500 }))
      .finally(() => setIsButtonDisabled(false));
  };

  const handleOrderNow = () => {
    if (!customerName || !selectedTextColor || !selectedBaseColor || !selectedSize) {
      setShowErrors(true);
      const message = !customerName ? "Please enter Name"
        : !selectedTextColor ? "Please select Text Color"
          : !selectedBaseColor ? "Please select Base Color"
            : "Please select Size";
      toast.error(message, { duration: 1800 });
      return;
    }
    setShowErrors(false);
    setIsButtonDisabled(true);
    dispatch(addToCart({
      productId: productFetchId, quantity, size: selectedSize,
      custName: customerName, textColor: selectedTextColor,
      baseColor: selectedBaseColor, guestId, userId: user?._id,
    }))
      .then(() => navigate("/checkout"))
      .finally(() => setIsButtonDisabled(false));
  };

  // error border helpers
  const errBorder = (invalid) =>
    invalid ? "border-red-500/70 ring-1 ring-red-500/40" : "border-white/10";
  const errLabel = (invalid) =>
    invalid ? "text-red-400" : "text-slate-400";

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square bg-white/5 rounded-2xl" />
          <div className="flex gap-3">{Array(3).fill(0).map((_, i) => <div key={i} className="w-20 h-20 bg-white/5 rounded-lg" />)}</div>
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-lg w-full" />)}
        </div>
        <div className="flex flex-col gap-5">{Array(6).fill(0).map((_, i) => <div key={i} className="h-7 bg-white/5 rounded-lg w-full" />)}</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-orange-400">Error: {error}</div>
  );

  if (!selectedProduct) return null;

  return (
    <div className="bg-[#0B0F19] min-h-screen pt-28 pb-28 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs */}
        <motion.nav variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center text-sm text-slate-500 mb-10">
          <span className="hover:text-orange-400 cursor-pointer transition-colors">Home</span>
          <ChevronRight size={14} className="mx-2 text-slate-600" />
          <span className="hover:text-orange-400 cursor-pointer transition-colors">Products</span>
          <ChevronRight size={14} className="mx-2 text-slate-600" />
          <span className="text-slate-300 font-medium truncate">{selectedProduct.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ══════════ LEFT: Image + Config ══════════ */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="flex flex-col gap-5 lg:sticky lg:top-32 h-fit">

            {/* Product Name — above image */}
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="text-3xl sm:text-4xl font-black tracking-tighter leading-[1.1] text-white">
              {selectedProduct.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">
                {selectedProduct.name.split(" ").slice(-1)}
              </span>
            </motion.h1>

            {/* Main Image */}
            <div className="relative w-full aspect-square sm:aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#ff6200]/20 to-orange-400/5 blur-xl z-0" />
              <img src={mainImage} alt={selectedProduct.name}
                className="relative z-10 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none rounded-b-2xl" />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide justify-center">
              {selectedProduct?.images?.map((image, index) => (
                <button key={index} onClick={() => setMainImage(image.url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${mainImage === image.url
                    ? "border-[#ff6200] ring-2 ring-orange-500/40 scale-105"
                    : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                    }`}>
                  <img src={image.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* ── Personalization ── */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${errLabel(showErrors && !customerName)}`}>
                {showErrors && !customerName ? "⚠ Enter a name to print" : "Personalization"}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); if (showErrors) setShowErrors(false); }}
                placeholder="Enter name to print"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-base text-white outline-none placeholder:text-slate-600 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all ${errBorder(showErrors && !customerName)}`}
              />
            </div>

            {/* ── Colors ── */}
            <div className="grid grid-cols-2 gap-5">
              {/* Text Color */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${errLabel(showErrors && !selectedTextColor)}`}>
                  {showErrors && !selectedTextColor ? "⚠ Text Color" : "Text Color"}
                </label>
                <div className={`flex flex-wrap gap-3 p-2 rounded-xl border transition-all ${showErrors && !selectedTextColor ? "border-red-500/50 bg-red-500/5" : "border-transparent"}`}>
                  {selectedProduct.textColors.map((color) => (
                    <button key={color} onClick={() => { setSelectedTextColor(color); if (showErrors) setShowErrors(false); }}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${selectedTextColor === color
                        ? "border-orange-500 ring-2 ring-orange-500/40 ring-offset-2 ring-offset-[#0B0F19] scale-110"
                        : "border-white/20 hover:scale-105 hover:border-white/40"
                        }`}
                      style={{ backgroundColor: color.toLowerCase() }} title={color} />
                  ))}
                </div>
              </div>

              {/* Base Color */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${errLabel(showErrors && !selectedBaseColor)}`}>
                  {showErrors && !selectedBaseColor ? "⚠ Base Color" : "Base Color"}
                </label>
                <div className={`flex flex-wrap gap-3 p-2 rounded-xl border transition-all ${showErrors && !selectedBaseColor ? "border-red-500/50 bg-red-500/5" : "border-transparent"}`}>
                  {selectedProduct.baseColors.map((color) => (
                    <button key={color} onClick={() => { setSelectedBaseColor(color); if (showErrors) setShowErrors(false); }}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${selectedBaseColor === color
                        ? "border-orange-500 ring-2 ring-orange-500/40 ring-offset-2 ring-offset-[#0B0F19] scale-110"
                        : "border-white/20 hover:scale-105 hover:border-white/40"
                        }`}
                      style={{ backgroundColor: color.toLowerCase() }} title={color} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Size ── */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className={`block text-xs font-bold uppercase tracking-widest transition-colors ${errLabel(showErrors && !selectedSize)}`}>
                  {showErrors && !selectedSize ? "⚠ Select a Size" : "Size"}
                </label>
                <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium underline underline-offset-2">
                  Size Guide
                </button>
              </div>
              <div className={`flex flex-wrap gap-3 p-2 rounded-xl border transition-all ${showErrors && !selectedSize ? "border-red-500/50 bg-red-500/5" : "border-transparent"}`}>
                {selectedProduct.sizes.map((size) => (
                  <button key={size} onClick={() => { setSelectedSize(size); if (showErrors) setShowErrors(false); }}
                    className={`min-w-[3.5rem] px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedSize === size
                      ? "bg-[#ff6200] text-white border-[#ff6200] shadow-lg shadow-orange-500/25"
                      : "bg-white/5 text-slate-300 border-white/10 hover:border-white/30 hover:text-white"
                      }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: Qty + Add to Cart + Order Now */}
            <div className="hidden sm:flex flex-col gap-3 pt-1">
              {/* Qty row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/5 w-32 shrink-0 h-12">
                  <button onClick={() => handleQuantityChange("minus")}
                    className="flex-1 h-full flex items-center justify-center text-slate-400 hover:text-orange-400 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-base text-white select-none">{quantity}</span>
                  <button onClick={() => handleQuantityChange("plus")}
                    className="flex-1 h-full flex items-center justify-center text-slate-400 hover:text-orange-400 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Qty</span>
              </div>
              {/* Buttons row */}
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart} disabled={isButtonDisabled}
                  className="flex-1 bg-white/10 hover:bg-white/15 border border-white/15 text-white h-13 py-3 rounded-xl font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleOrderNow} disabled={isButtonDisabled}
                  className="flex-1 bg-[#ff6200] hover:bg-[#e55a00] text-white h-13 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                  <ArrowRight size={18} />
                  <span>Order Now</span>
                </motion.button>
              </div>
            </div>

          </motion.div>

          {/* ══════════ RIGHT: Product Info ══════════ */}
          <div className="flex flex-col">

            {/* Badge */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-orange-400 text-xs font-bold tracking-[0.18em] uppercase shadow-lg">
                <Zap size={12} className="fill-orange-400" />
                <span>Custom 3D Printed</span>
              </div>
            </motion.div>

            {/* Rating + Price */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-3xl font-black text-white">₹{selectedProduct.price}</span>
              {selectedProduct.originalPrice && (
                <span className="text-lg text-slate-500 line-through">₹{selectedProduct.originalPrice}</span>
              )}
              <div className="ml-auto flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-orange-400 text-sm font-semibold">
                <Star size={13} fill="currentColor" />
                <span>{averageRating} <span className="text-slate-400 font-normal">({totalReviews} reviews)</span></span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="text-slate-400 leading-relaxed text-base mb-8"
              dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />

            <div className="h-px bg-white/10 mb-8" />

            {/* Trust Badges */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="grid grid-cols-3 gap-4">
              {[
                { icon: <Truck size={20} />, label: "Fast Delivery" },
                { icon: <RotateCcw size={20} />, label: "Easy Returns" },
                { icon: <ShieldCheck size={20} />, label: "Secure Pay" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-orange-400">{icon}</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
                </div>
              ))}
            </motion.div>

          </div>
        </div>

        {/* ── STICKY BOTTOM BAR — mobile only ── */}
        {!isCartOpen && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              {/* Qty */}
              <div className="flex items-center border border-white/15 rounded-xl overflow-hidden bg-white/5 h-12 w-24 shrink-0">
                <button onClick={() => handleQuantityChange("minus")}
                  className="flex-1 h-full flex items-center justify-center text-slate-400 active:text-orange-400 transition-colors">
                  <Minus size={15} />
                </button>
                <span className="w-6 text-center font-bold text-sm text-white select-none">{quantity}</span>
                <button onClick={() => handleQuantityChange("plus")}
                  className="flex-1 h-full flex items-center justify-center text-slate-400 active:text-orange-400 transition-colors">
                  <Plus size={15} />
                </button>
              </div>
              {/* Add to Cart */}
              <motion.button whileTap={{ scale: 0.96 }} onClick={handleAddToCart} disabled={isButtonDisabled}
                className="flex-1 bg-white/10 active:bg-white/20 border border-white/15 text-white h-12 rounded-xl font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs">
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </motion.button>
              {/* Order Now */}
              <motion.button whileTap={{ scale: 0.96 }} onClick={handleOrderNow} disabled={isButtonDisabled}
                className="flex-1 bg-[#ff6200] active:bg-[#cc5000] text-white h-12 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs">
                <ArrowRight size={16} />
                <span>Order Now</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-24 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2 text-center">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">Reviews</span>
          </h2>
          <p className="text-slate-500 text-sm text-center mb-10">What our customers are saying</p>
          <TextRating productId={selectedProduct?._id} />
        </motion.div>

        {/* ── SIMILAR PRODUCTS ── */}
        {similarProducts && similarProducts.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-black tracking-tight text-white mb-2 text-center">
              You May <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6200] to-orange-400">Also Like</span>
            </h2>
            <p className="text-slate-500 text-sm text-center mb-12">Handpicked for you</p>
            <ProductGrid products={similarProducts} loading={loading} error={error} />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
