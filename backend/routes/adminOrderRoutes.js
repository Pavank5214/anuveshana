const express = require('express');
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');
const { protect, admin } = require('../middleware/authMiddleware');
const { sendOrderStatusUpdateEmail } = require('../utils/emailUtils');

const router = express.Router();

// @route GET / api/admin/order
// @desc Get all orders
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });

        const ordersWithTickets = await Promise.all(orders.map(async (order) => {
            const ticketCount = await Ticket.countDocuments({
                orderId: order.orderId || order._id.toString(),
                status: { $ne: "Closed" }
            });
            return { ...order.toObject(), ticketCount };
        }));

        res.json(ordersWithTickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route GET / api/admin/orders/new-count
// @desc Get count of unread orders
// @access Private/Admin
router.get('/new-count', protect, admin, async (req, res) => {
    try {
        const count = await Order.countDocuments({ isNew: true });
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route GET / api/admin/orders/:id
// @desc Get order details by ID
// @access Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ msg: 'Order not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route PUT / api/admin/order/:id
// @desc Update order to status
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name');
        if (order) {
            const oldStatus = order.status;
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered;
            order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt;
            order.trackingId = req.body.trackingId !== undefined ? req.body.trackingId : order.trackingId;
            order.trackingUrl = req.body.trackingUrl !== undefined ? req.body.trackingUrl : order.trackingUrl;
            order.courier = req.body.courier !== undefined ? req.body.courier : order.courier;

            // Mark as not new anymore
            order.isNew = false;

            const updatedOrder = await order.save();

            // Send order status update email if status has changed
            if (req.body.status && req.body.status !== oldStatus) {
                try {
                    await sendOrderStatusUpdateEmail(updatedOrder);
                } catch (emailError) {
                    console.error("Error sending order status update email:", emailError);
                }
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ msg: 'Order not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route DELETE / api/admin/order/:id
// @desc Delete order
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order deleted successfully" });
        } else {
            res.status(404).json({ msg: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
})

module.exports = router;