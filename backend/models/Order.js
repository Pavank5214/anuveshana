const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: String,
    custName: String,
    textColor: String,
    baseColor: String,
    personalization: { type: Map, of: String },
}, { _id: false });


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: String,
        unique: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        pincode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    email: { type: String, required: true },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    status: {
        type: String,
        enum: ["Placed", "Processing", "Printing", "Shipped", "Delivered", "Cancelled"],
        default: "Placed"
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed
    },
    trackingId: {
        type: String,
        default: ""
    },
    trackingUrl: {
        type: String,
        default: ""
    },
    courier: {
        type: String,
        default: ""
    },
    isNew: {
        type: Boolean,
        default: true
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);

