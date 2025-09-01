import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { fetchAdminProducts, deleteProduct } from "../../redux/slices/adminProductSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchAdminProducts())
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p className="text-white">Loading...</p>
  if (error) return <p className="text-red-400">Error: {error}</p>

  return (
    <div className="min-h-screen p-6 bg-gray-500">
      <h2 className="text-3xl font-bold mb-6 text-white">Product Management</h2>

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-white">All Products</h3>
        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          + Add Product
        </button>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-gray-50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className='bg-gray-200 text-gray-700 text-sm uppercase'>
            <tr>
              <th className='py-3 px-4 text-left'>Name</th>
              <th className='py-3 px-4 text-left'>Price</th>
              <th className='py-3 px-4 text-left'>SKU</th>
              <th className='py-3 px-4 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
            {products.length > 0 ? products.map((product) => (
              <tr key={product._id} className='hover:bg-gray-100 transition cursor-pointer'>
                <td className="py-3 px-4 font-medium">{product.name}</td>
                <td className="py-3 px-4">${product.price}</td>
                <td className="py-3 px-4">{product.sku}</td>
                <td className="py-3 px-4 flex gap-2">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg font-medium transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium transition'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className='py-4 text-center text-gray-500'>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement;
