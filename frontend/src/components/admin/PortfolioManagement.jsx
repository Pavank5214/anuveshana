import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPortfolios, deletePortfolio } from "../../redux/slices/portfolioSlice";
import { FaEdit, FaTrash } from "react-icons/fa";

const PortfolioManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolios());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      dispatch(deletePortfolio(id));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-500">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-400 font-semibold">
        Error: {error}
      </p>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-500">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
        <button
          onClick={() => navigate("/admin/portfolio/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition font-medium"
        >
          + Add Portfolio
        </button>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white shadow-md rounded-xl overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-gray-700">
          <thead className="bg-gray-100 text-left text-sm uppercase">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {portfolios.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 font-medium">
                  No portfolio items found.
                </td>
              </tr>
            ) : (
              portfolios.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-16 object-cover rounded-lg shadow"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 capitalize">{item.category}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{item.description}</td>
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => navigate(`/admin/portfolio/${item._id}/edit`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioManagement;
