import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "sonner";

const TextRating = ({ productId }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all reviews for this product
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/api/reviews/${productId}`);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // ✅ Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Check if user is logged in
    if (!user) {
      toast.warning("Please log in to submit a review");
      // redirect after 1.2s
      return;
    }

    if (!rating || !feedback) {
      toast.error("Please provide a rating and feedback");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/reviews", {
        productId,
        rating,
        feedback,
        userName: user?.name,
        email: user?.email,
      });

      toast.success(data.message || "Review submitted successfully");
      setRating(0);
      setFeedback("");
      fetchReviews(); // ✅ Refresh reviews
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      {/* ✅ Average Rating */}
      <div className="mb-5">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
          ⭐ Average Rating:{" "}
          <span className="text-yellow-500 text-xl">{averageRating}</span>
          <span className="text-gray-500 text-sm">/ 5</span>
        </h4>
      </div>

      {/* ✅ Rating Form */}
      <h3 className="text-xl font-semibold mb-4">Rate this product</h3>

      {/* Star Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Feedback Input */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Write your feedback..."
        rows={3}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
      >
        Submit Review
      </button>

      {/* ✅ Reviews List */}
      <div className="mt-5">
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                {/* User Info */}
                <div className="flex justify-between items-center">
                  <h5 className="font-semibold text-gray-800">
                    {review.userName}
                  </h5>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Feedback */}
                <p className="mt-2 text-gray-700">{review.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextRating;
