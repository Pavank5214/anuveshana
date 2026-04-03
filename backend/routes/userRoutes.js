const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { protect } = require("../middleware/authMiddleware");
const { sendOTPEmail } = require('../utils/emailUtils');
const router = express.Router();

// @route POST /api/users/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase();
    try {
        // Registration logic
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "user already exists" });
        user = new User({ name, email, password });
        await user.save();

        // create JWT Payload
        const payload = { user: { id: user._id, role: user.role } };
        // sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
            if (err) throw err;
            // Send the user and token in response
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post("/login", async (req, res) => {

    const { password } = req.body;
    const email = req.body.email.toLowerCase();
    try {
        // find user by email
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Email" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

        // create JWT Payload
        const payload = { user: { id: user._id, role: user.role } };
        // sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;
            // Send the user and token in response
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })

        });
    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
    }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile(protected route)
// @access private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
})

// @route POST /api/users/forgot-password
// @desc Send OTP to email
// @access Public
router.post('/forgot-password', async (req, res) => {
    const email = req.body.email.toLowerCase();
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        await sendOTPEmail(user, otp);
        res.json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route POST /api/users/verify-otp
// @desc Verify OTP
// @access Public
router.post('/verify-otp', async (req, res) => {
    const email = req.body.email.toLowerCase();
    const { otp } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route POST /api/users/reset-password
// @desc Reset password
// @access Public
router.post('/reset-password', async (req, res) => {
    const email = req.body.email.toLowerCase();
    const { otp, newPassword } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ... existing routes ...

// --- Address Management ---

// @route GET /api/users/profile/addresses
// @desc Get all user addresses
// @access private
router.get("/profile/addresses", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("addresses");
        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route POST /api/users/profile/addresses
// @desc Add a new address
// @access private
router.post("/profile/addresses", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { firstName, lastName, address, city, state, pincode, phone, isDefault } = req.body;

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({ firstName, lastName, address, city, state, pincode, phone, isDefault: isDefault || user.addresses.length === 0 });
        await user.save();
        res.status(201).json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route PUT /api/users/profile/addresses/:id
// @desc Update an existing address
// @access private
router.put("/profile/addresses/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.addresses.id(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });

        const { firstName, lastName, address: street, city, state, pincode, phone, isDefault } = req.body;

        if (isDefault && !address.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        address.firstName = firstName || address.firstName;
        address.lastName = lastName || address.lastName;
        address.address = street || address.address;
        address.city = city || address.city;
        address.state = state || address.state;
        address.pincode = pincode || address.pincode;
        address.phone = phone || address.phone;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route DELETE /api/users/profile/addresses/:id
// @desc Delete an address
// @access private
router.delete("/profile/addresses/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route PATCH /api/users/profile/addresses/:id/default
// @desc Set address as default
// @access private
router.patch("/profile/addresses/:id/default", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === req.params.id;
        });
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route POST /api/users/google-login
// @desc Google Login/Register
// @access Public
router.post('/google-login', async (req, res) => {
    const { accessToken, action } = req.body; // action: 'login' or 'register'
    try {
        // Fetch user info from Google using the access token
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const { name, sub: googleId } = response.data;
        const email = response.data.email.toLowerCase();

        let user = await User.findOne({ email });

        if (!user) {
            if (action === 'login') {
                return res.status(404).json({ message: "Account not found. Please register first." });
            }
            // Register flow
            user = new User({ name, email, googleId });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }

        const payload = { user: { id: user._id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            });
        });
    } catch (error) {
        console.error("Google Login Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Google Authentication failed" });
    }
});

module.exports = router;