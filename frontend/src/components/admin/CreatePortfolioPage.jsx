import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { createPortfolio, fetchPortfolios } from "../../redux/slices/portfolioSlice";

const CreatePortfolioPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [portfolioData, setPortfolioData] = useState({
    name: "",
    description: "",
    images: [],
    category: "",
  });

  const [uploading, setUploading] = useState(false);

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

      // ✅ Push image URL into images array
      setPortfolioData((prev) => ({
        ...prev,
        images: [...prev.images, data.imageUrl],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
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
    try {
      await dispatch(createPortfolio(portfolioData)).unwrap();
      dispatch(fetchPortfolios());
      navigate("/portfolio");
    } catch (error) {
      console.error("Failed to create portfolio:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Create New Portfolio
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="name"
            value={portfolioData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={portfolioData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows="4"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={portfolioData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Upload Images</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg"
          />
          {uploading && <p className="text-blue-600 mt-2">Uploading...</p>}

          {portfolioData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {portfolioData.images.map((img, idx) => (
                <div key={idx} className="relative border rounded-lg overflow-hidden shadow">
                  <img src={img} alt="Portfolio" className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Create Portfolio
        </button>
      </form>
    </div>
  );
};

export default CreatePortfolioPage;
