import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  fetchPortfolioDetails,
  updatePortfolio,
} from "../../redux/slices/portfolioSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Upload,
  X,
  Type,
  AlignLeft,
  Tag,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  Loader2,
  Rocket,
  Trash2,
  AlertCircle,
  Save
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const EditPortfolioPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedPortfolio, loading, error } = useSelector(
    (state) => state.portfolio
  );

  const [portfolioData, setPortfolioData] = useState({
    name: "",
    description: "",
    images: [],
    category: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchPortfolioDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedPortfolio) {
      setPortfolioData({
        name: selectedPortfolio.name || "",
        description: selectedPortfolio.description || "",
        images: selectedPortfolio.images || [],
        category: selectedPortfolio.category || "",
      });
    }
  }, [selectedPortfolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPortfolioData((prev) => ({
        ...prev,
        images: [...prev.images, data.imageUrl],
      }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setPortfolioData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (portfolioData.images.length === 0) {
      return toast.error("Please add at least one image");
    }

    try {
      const normalizedData = {
        ...portfolioData,
        images: portfolioData.images.map(img => typeof img === 'string' ? img : img.url)
      };

      await dispatch(updatePortfolio({ id, updatedData: normalizedData })).unwrap();
      toast.success("Project updated");
      navigate("/admin/portfolio");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading && !selectedPortfolio) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 sm:p-6 lg:p-10 text-left">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
          <Link to="/admin/portfolio" className="group flex items-center gap-2 text-slate-500 hover:text-white transition-all w-fit">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to List</span>
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5">
              <Pencil size={22} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Edit Project</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Update: {portfolioData.name || 'Current Item'}</p>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Primary Section */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="lg:col-span-8 space-y-8">
            <div className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-2xl">
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} className="text-blue-500" /> Title
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={portfolioData.name}
                    onChange={handleChange}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Tag size={12} className="text-blue-500" /> Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={portfolioData.category}
                    onChange={handleChange}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <AlignLeft size={12} className="text-blue-500" /> Description
                  </label>
                  <textarea
                    name="description"
                    value={portfolioData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Photos Gallery */}
            <div className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ImageIcon size={12} className="text-blue-500" /> Photos
                </label>
                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">{portfolioData.images.length} Images</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence>
                  {portfolioData.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative group aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden bg-[#0B0F19]"
                    >
                      <img
                        src={typeof img === 'string' ? img : img.url}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all"
                        alt=""
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <label className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/30 flex flex-col items-center justify-center cursor-pointer group transition-all bg-white/[0.01] hover:bg-blue-500/5">
                  <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                  {uploading ? (
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                        <Plus size={20} />
                      </div>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Add New Photo</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </motion.div>

          {/* Button List */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="lg:col-span-4 space-y-8">
            <div className="bg-[#121620] border border-white/[0.06] rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.03] blur-[60px] rounded-full" />

              <div className="space-y-4 relative z-10">
                <button
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  <Save size={18} className="group-hover:scale-110 transition-transform" />
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/portfolio")}
                  className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
                >
                  Discard
                </button>
              </div>

              <div className="pt-6 border-t border-white/[0.04]">
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle size={14} className="text-emerald-500/50" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">Changes will be saved to your list</p>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolioPage;
