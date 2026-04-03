import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ArrowLeft,
  Upload,
  X,
  Type,
  AlignLeft,
  DollarSign,
  Tag,
  Layers,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
  Settings2
} from "lucide-react";
import { toast } from "sonner";
import PersonalizationManager from "./PersonalizationManager";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const FormInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5 text-left">
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-400 transition-colors" />}
      <input
        {...props}
        className={`w-full bg-[#0B0F19] border border-white/10 rounded-xl ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 text-sm text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 transition-all`}
      />
    </div>
  </div>
);

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    sku: "",
    category: "",
    sizes: [],
    textColors: [],
    baseColors: [],
    collections: "",
    images: [],
    personalizationFields: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        price: selectedProduct.price || 0,
        discountPrice: selectedProduct.discountPrice || 0,
        sizes: selectedProduct.sizes || [],
        textColors: selectedProduct.textColors || [],
        baseColors: selectedProduct.baseColors || [],
        images: selectedProduct.images || [],
        collections: selectedProduct.collections || "",
        personalizationFields: selectedProduct.personalizationFields || [],
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct({ id, productData })).unwrap();
      await dispatch(fetchAdminProducts());
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={32} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="text-center bg-red-500/5 border border-red-500/20 p-8 rounded-2xl">
        <p className="text-red-400 font-medium mb-4">Error: {error}</p>
        <button onClick={() => navigate("/admin/products")} className="text-white bg-red-500 px-6 py-2 rounded-xl text-xs font-bold uppercase">Back to Products</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      {/* Ambient backgrounds */}
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/[0.02] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <motion.button
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            onClick={() => navigate("/admin/products")}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1} className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-[10px] font-black text-orange-500/80 bg-orange-500/5 border border-orange-500/10 px-2 py-0.5 rounded uppercase tracking-widest truncate">ID: {id?.slice(-8).toUpperCase()}</span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Edit Product</h2>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">Updating Master Catalog</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

          {/* Identity Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-2">
              <Package size={14} className="text-orange-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">General Information</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-5 text-left">
              <FormInput
                label="Product Title" icon={Type} name="name"
                value={productData.name} onChange={handleChange}
                placeholder="Product name" required
              />
              <div className="space-y-1.5 font-bold">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Description</label>
                <div className="relative group">
                  <AlignLeft size={14} className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                  <textarea
                    name="description" value={productData.description} onChange={handleChange}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-orange-500/50 transition-all min-h-[140px]"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Logistics Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-2">
              <DollarSign size={14} className="text-orange-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Pricing & Logistics</h3>
            </div>
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Listing Price (₹)" icon={DollarSign} type="number" name="price"
                value={productData.price} onChange={handleChange}
                required
              />
              <FormInput
                label="Discount Price (₹)" icon={DollarSign} type="number" name="discountPrice"
                value={productData.discountPrice} onChange={handleChange}
              />
              <FormInput
                label="Identifier (SKU)" icon={Tag} name="sku"
                value={productData.sku} onChange={handleChange}
                required
              />
              <FormInput
                label="Primary Category" icon={Layers} name="category"
                value={productData.category} onChange={handleChange}
                required
              />
            </div>
          </motion.div>


          {/* Personalization Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3.5} className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 sm:p-6 italic">
              <PersonalizationManager
                fields={productData.personalizationFields}
                onUpdate={(fields) => setProductData({ ...productData, personalizationFields: fields })}
              />
            </div>
          </motion.div>

          {/* Imagery Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="bg-[#121620] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={14} className="text-orange-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Product Imagery</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{productData.images.length} Files</span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap gap-4">
                {productData.images.map((img, idx) => (
                  <motion.div
                    key={idx} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="group relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-white/10 bg-[#0B0F19]"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button" onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent pointer-events-none transition-colors" />
                  </motion.div>
                ))}

                <label className="flex flex-col items-center justify-center w-24 h-28 sm:w-28 sm:h-32 rounded-xl border-2 border-dashed border-white/5 bg-white/5 hover:bg-white/[0.07] hover:border-orange-500/30 transition-all cursor-pointer group">
                  <input type="file" onChange={handleImageUpload} className="hidden" />
                  {uploading ? (
                    <Loader2 size={24} className="text-orange-500 animate-spin" />
                  ) : (
                    <>
                      <Upload size={20} className="text-slate-500 group-hover:text-orange-500 transition-colors mb-2" />
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center px-1">Add Image</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </motion.div>

          {/* Action Row */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="pt-4 sm:pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#ff6200] hover:bg-[#e55a00] text-white font-black py-4 rounded-xl tracking-widest uppercase text-xs sm:text-sm shadow-xl shadow-orange-500/15 transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCcw size={18} className="transition-transform group-hover:rotate-180 duration-700" />
              <span>Update Catalog Item</span>
            </button>
            <button
              type="button" onClick={() => navigate("/admin/products")}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              Discard Changes
            </button>
          </motion.div>
        </form>

        <div className="mt-12 mb-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-700">
            <ShieldCheck size={12} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Master Control</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <RefreshCcw size={12} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Auto Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
