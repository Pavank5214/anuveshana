import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import TextRating from "../common/TextRating"

const ProductDetails = ({ productId }) => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  }, []);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [selectedTextColor, setSelectedTextColor] = useState(null);
  const [selectedBaseColor, setSelectedBaseColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!customerName || !selectedTextColor || !selectedBaseColor || !selectedSize) {
      const message = 
        !customerName
        ? "Please enter Name"
        : !selectedTextColor
        ? "Please select TextColor"
        : !selectedBaseColor
        ? "Please select BaseColor"
        : "Please select Size";
    
      toast.error(message, { duration: 1200 });
      return;
    }
    

    

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        custName: customerName,
        textColor: selectedTextColor,
        baseColor: selectedBaseColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Added to cart!", { duration: 1200 });
      })
      .finally(() => setIsButtonDisabled(false));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 animate-pulse mt-20">
        {/* Left: Image skeleton */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-[500px] bg-gray-300 rounded-xl" />
          <div className="flex gap-3 overflow-x-auto">
            {Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="w-20 h-20 bg-gray-300 rounded-lg" />
            ))}
          </div>
        </div>
  
        {/* Right: Info skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 bg-gray-300 rounded" /> {/* Product title */}
          <div className="h-6 w-1/2 bg-gray-300 rounded" /> {/* Price */}
          <div className="h-6 w-1/3 bg-gray-300 rounded" /> {/* Original price */}
          
          {/* Custom name input */}
          <div className="h-12 w-full bg-gray-300 rounded" />
          
          {/* Color selectors */}
          <div className="flex gap-3 mt-2">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="w-9 h-9 bg-gray-300 rounded-full" />
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="w-9 h-9 bg-gray-300 rounded-full" />
            ))}
          </div>
  
          {/* Size selector */}
          <div className="flex gap-3 mt-2">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="px-5 py-2 bg-gray-300 rounded-lg" />
            ))}
          </div>
  
          {/* Quantity selector */}
          <div className="flex gap-3 mt-2 items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-lg" />
            <div className="w-6 h-6 bg-gray-300 rounded" />
            <div className="w-10 h-10 bg-gray-300 rounded-lg" />
          </div>
  
          {/* Add to cart button */}
          <div className="w-full h-12 bg-gray-300 rounded-lg mt-4" />
  
          {/* Description */}
          <div className="h-4 w-full bg-gray-300 rounded mt-4" />
          <div className="h-4 w-5/6 bg-gray-300 rounded mt-2" />
          <div className="h-4 w-2/3 bg-gray-300 rounded mt-2" />
        </div>
      </div>
    );
  }
  
  
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-30">
      {selectedProduct && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left: Image Gallery */}
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="w-full">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-[500px] object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                />
              </div>
              {/* Thumbnail images */}
              <div className="flex mt-5 gap-3 overflow-x-auto md:overflow-visible">
                {selectedProduct?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition-all ${
                      mainImage === image.url ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-gray-500 text-lg mb-1 line-through">
                {selectedProduct.originalPrice && `₹${selectedProduct.originalPrice}`}
              </p>
              <p className="text-2xl font-semibold text-gray-800 mb-3">
                ₹{selectedProduct.price}
              </p>
    


              <p className="text-gray-800 font-medium mt-5 mb-3">Enter Your Custom Name:</p>
              <input
                type="text"
                value={customerName}
                onChange = {(e)=> setCustomerName(e.target.value)}
                className=" p-3 mb-5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Enter name "
                required
              />

              {/* Color Selector */}
              <div className="mb-5">
                <p className="text-gray-800 font-medium">Text Color:</p>
                <div className="flex gap-3 mt-2">
                  {selectedProduct.textColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedTextColor(color)}
                      className={`w-9 h-9 rounded-full border ${
                        selectedTextColor === color
                          ? "border-4 border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.9)",
                      }}
                    />
                  ))}
                  
                </div>
                <p className="text-gray-800 mt-4 font-medium">Base Color:</p>
                <div className="flex gap-3 mt-2">
                  {selectedProduct.baseColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedBaseColor(color)}
                      className={`w-9 h-9 rounded-full border ${
                        selectedBaseColor === color
                          ? "border-4 border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.9)",
                      }}
                    />
                  ))}
                  
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-5">
                <p className="text-gray-800 font-medium">Size:</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-lg border font-medium transition ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-gray-800 font-medium">Quantity:</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-3 py-1 bg-gray-200 rounded-lg text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-3 py-1 bg-gray-200 rounded-lg text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-3 px-6 rounded-lg w-full shadow-md transition ${
                  isButtonDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>

              <p
  className="text-gray-700 leading-relaxed mt-10"
  dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
></p>

              {/* Product Details Table */}
              {/* <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Product Details
                </h3>
                <table className="w-full text-left text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3">Brand</td>
                      <td className="py-2 px-3">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Material</td>
                      <td className="py-2 px-3">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
            </div>
          </div>
          <TextRating productId={selectedProduct?._id} />



          {/* Similar Products */}
          {/* <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-8">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
            <h1>page</h1>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
