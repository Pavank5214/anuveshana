const express = require("express");
const Ticket = require("../models/Ticket");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendTicketNotificationEmail } = require("../utils/emailUtils");

const router = express.Router();

const generateTicketId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Avoiding confusing chars like I, O, 1, 0
    let id = "";
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

// @route   GET /api/tickets/count/unread
// @desc    Get count of unread tickets (Admin)
// @access  Private/Admin
router.get("/count/unread", protect, admin, async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: { $in: ["Open", "In Progress"] } });
        const count = tickets.filter(t => t.messages.length > 0 && t.messages[t.messages.length - 1].sender === "user").length;
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/tickets/count/user-unread
// @desc    Get count of unread tickets (User - last message from admin)
// @access  Private
router.get("/count/user-unread", protect, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id, status: { $ne: "Closed" } });
        const count = tickets.filter(t => t.messages.length > 0 && t.messages[t.messages.length - 1].sender === "admin").length;
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/tickets
// @desc    Create a new support ticket
// @access  Private
router.post("/", protect, async (req, res) => {
    const { orderId, subject, category, message } = req.body;

    try {
        let ticketId = generateTicketId();
        let existing = await Ticket.findOne({ ticketId });
        while (existing) {
            ticketId = generateTicketId();
            existing = await Ticket.findOne({ ticketId });
        }

        const ticket = await Ticket.create({
            user: req.user._id,
            ticketId,
            orderId,
            subject,
            category,
            messages: [{
                sender: "user",
                senderName: req.user.name,
                message: message,
                timestamp: Date.now()
            }],
            lastMessageAt: Date.now()
        });

        const populatedTicket = await Ticket.findById(ticket._id).populate("user", "name email");

        // Notify Admin
        try {
            await sendTicketNotificationEmail(populatedTicket, message, 'admin');
        } catch (emailError) {
            console.error("Error sending ticket creation email:", emailError);
        }

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/tickets
// @desc    Get all tickets (Admin) or user's tickets (User)
// @access  Private
router.get("/", protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== "admin") {
            query.user = req.user._id;
        }

        if (req.query.orderId) {
            query.orderId = req.query.orderId;
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Ticket.countDocuments(query);
        const tickets = await Ticket.find(query)
            .populate("user", "name email")
            .sort({ lastMessageAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            tickets,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/tickets/:id
// @desc    Get ticket details
// @access  Private
router.get("/:id", protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate("user", "name email");

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Check ownership
        if (req.user.role !== "admin" && ticket.user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   PUT /api/tickets/:id/message
// @desc    Add a message to a ticket (Reply)
// @access  Private
router.put("/:id/message", protect, async (req, res) => {
    const { message } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Check ownership
        if (req.user.role !== "admin" && ticket.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const newMessage = {
            sender: req.user.role === "admin" ? "admin" : "user",
            senderName: req.user.name,
            message,
            timestamp: Date.now()
        };

        ticket.messages.push(newMessage);
        ticket.lastMessageAt = Date.now();

        // If it was closed/resolved, reopen it on user reply
        if (req.user.role !== "admin" && (ticket.status === "Closed" || ticket.status === "Resolved")) {
            ticket.status = "Open";
        } else if (req.user.role === "admin") {
            ticket.status = "In Progress";
        }

        await ticket.save();

        const populatedTicket = await Ticket.findById(ticket._id).populate("user", "name email");

        // Notify appropriate party
        try {
            const recipientRole = req.user.role === "admin" ? 'user' : 'admin';
            await sendTicketNotificationEmail(populatedTicket, message, recipientRole);
        } catch (emailError) {
            console.error("Error sending ticket message email:", emailError);
        }

        res.json(populatedTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
    const { status, priority } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;

        await ticket.save();
        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
