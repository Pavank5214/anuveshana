const express = require("express");
const Contact = require("../models/Contact");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc    Save a contact message
// @route   POST /api/contacts
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, number, message } = req.body;

    if (!name || !email || !number || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({ name, email, number, message });
    const createdContact = await contact.save();

    res.status(201).json(createdContact);
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contacts
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
