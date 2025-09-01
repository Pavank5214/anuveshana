import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  fetchPortfolioDetails,
  updatePortfolio,
} from "../../redux/slices/portfolioSlice";

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

  // ✅ Fetch portfolio details when page loads
  useEffect(() => {
    if (id) dispatch(fetchPortfolioDetails(id));
  }, [dispatch, id]);

  // ✅ Set portfolio data once fetched
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

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload
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

      // ✅ Push uploaded image as { url: "..." } object
      setPortfolioData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl }],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Remove image locally
  const removeImage = (index) => {
    setPortfolioData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit updated portfolio
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updatePortfolio({ id, updatedData: portfolioData })).unwrap();
      navigate("/portfolio");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Edit Portfolio</h2>
        <button
          onClick={() => navigate("/portfolio/create")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          + Create Portfolio
        </button>
      </div>

      {/* Loader & Error */}
      {loading && <p className="text-blue-600 mb-4">Loading portfolio...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="name"
            value={portfolioData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                <div
                  key={idx}
                  className="relative border rounded-lg overflow-hidden shadow"
                >
                  <img
                    src={img.url}
                    alt="Portfolio"
                    className="w-full h-24 object-cover"
                  />
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

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPortfolioPage;
