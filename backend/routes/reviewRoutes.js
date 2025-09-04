const express = require("express");
const Reviews = require("../models/Reviews");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private (protected route)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { productId, rating, feedback, userName, email } = req.body;

    // ✅ Validate required fields
    if (!productId || !rating || !feedback || !userName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create new review
    const review = new Reviews({
      productId,
      rating,
      feedback,
      userName,
      email,
    });

    const createdReview = await review.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: createdReview,
    });
  } catch (error) {
    console.error("❌ Error creating review:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   GET /api/reviews/:productId
 * @desc    Get all reviews for a specific product
 * @access  Public
 */
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Reviews.find({ productId: req.params.productId }).sort({
      createdAt: -1,
    });

    // ✅ Calculate average rating
    let avgRating = 0;
    if (reviews.length > 0) {
      const total = reviews.reduce((acc, review) => acc + review.rating, 0);
      avgRating = (total / reviews.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      reviews,
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
