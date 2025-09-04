import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";
import axios from "axios";

const CreateProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    sku: "",
    category: "",
    sizes: [],
    textColors: [],
    baseColors: [],
    collections: "",
    images: [],
    isFeatured: false,
    isPublished: false,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
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
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.imageUrl) {
        setProductData((prev) => ({
          ...prev,
          images: [...prev.images, { url: data.imageUrl, altText: "" }],
        }));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productData.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const formattedData = {
      ...productData,
      price: Number(productData.price),
    };

    try {
      await dispatch(createProduct(formattedData)).unwrap();
      await dispatch(fetchAdminProducts());
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err);
      alert(err.message || "Product creation failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Stock & SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
          <div>
            <label className="block font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Sizes, Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Sizes</label>
            <input
              type="text"
              name="sizes"
              value={productData.sizes.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  sizes: e.target.value.split(",").map((size) => size.trim()),
                })
              }
              placeholder="S, M, L, XL"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Text Colors</label>
            <input
              type="text"
              name="textColors"
              value={productData.textColors.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  textColors: e.target.value
                    .split(",")
                    .map((color) => color.trim()),
                })
              }
              placeholder="Red, Blue, Green"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Base Colors</label>
            <input
              type="text"
              name="baseColors"
              value={productData.baseColors.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  baseColors: e.target.value
                    .split(",")
                    .map((color) => color.trim()),
                })
              }
              placeholder="Black, White, Grey"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category, Brand, Collection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Collections</label>
            <input
              type="text"
              name="collections"
              value={productData.collections}
              onChange={handleChange}
              placeholder="Collection name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

      

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Images</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg"
          />
          {uploading && <p className="text-blue-600 mt-2">Uploading...</p>}

          {productData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {productData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative border rounded-lg overflow-hidden shadow"
                >
                  <img
                    src={img.url}
                    alt={img.altText || "Product"}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
