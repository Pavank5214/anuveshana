import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import axios from "axios";

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
    countInStock: 0,
    sku: "",
    category: "",
    // brand: "",
    sizes: [],
    textColors: [],
    baseColors: [],
    collections: "",
    // material: "",
    // gender: "Unisex",
    // tags: [],
    // dimensions: { length: 0, width: 0, height: 0 },
    // weight: 0,
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  // Set product data once loaded
  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        price: selectedProduct.price || 0,
        discountPrice: selectedProduct.discountPrice || 0,
        countInStock: selectedProduct.countInStock || 0,
        // weight: selectedProduct.weight || 0,
        sizes: selectedProduct.sizes || [],
        textColors: selectedProduct.textColors || [],
        baseColors: selectedProduct.baseColors || [],
        // tags: selectedProduct.tags || [],
        images: selectedProduct.images || [],
        // dimensions: selectedProduct.dimensions || { length: 0, width: 0, height: 0 },
      });
    }
  }, [selectedProduct]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image upload
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
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct({ id, productData })).unwrap();
      await dispatch(fetchAdminProducts());
      navigate("/admin/products");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
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
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={productData.discountPrice}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stock, SKU & Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Count In Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div>
            <label className="block font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={productData.weight}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
        </div>

        {/* Sizes, Colors, Tags */}
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

        {/* Tags */}
        {/* <div>
          <label className="block font-medium mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={productData.tags.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              })
            }
            placeholder="Trending, New Arrival, Summer"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        {/* Category, Brand, Collections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div>
            <label className="block font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <div>
            <label className="block font-medium mb-1">Collections</label>
            <input
              type="text"
              name="collections"
              value={productData.collections}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Material & Gender */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Material</label>
            <input
              type="text"
              name="material"
              value={productData.material}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={productData.gender}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div> */}

        {/* Dimensions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Length (cm)</label>
            <input
              type="number"
              value={productData.dimensions.length}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  dimensions: { ...productData.dimensions, length: e.target.value },
                })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Width (cm)</label>
            <input
              type="number"
              value={productData.dimensions.width}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  dimensions: { ...productData.dimensions, width: e.target.value },
                })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              value={productData.dimensions.height}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  dimensions: { ...productData.dimensions, height: e.target.value },
                })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div> */}

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
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
