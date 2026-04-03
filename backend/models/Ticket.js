const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ["user", "admin"],
        required: true
    },
    senderName: String,
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ticketId: {
        type: String,
        unique: true
    },
    orderId: {
        type: String, // Can be the 10-digit ID or MongoDB ID string
    },
    subject: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["tracking", "cancellation", "quality", "payment", "other"]
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    messages: [messageSchema],
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
