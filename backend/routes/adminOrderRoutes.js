const express = require('express');
const Order = require('../models/Order');
const {protect, admin} = require('../middleware/authMiddleware');

const router = express.Router();

// @route GRT / api/admin/order
// @desc Get all orders
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email');
        res.json(orders);
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
        if(order){
            order.status = req.body.status || order.status ;
            order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered ;
            order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt ;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else{
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
        const order =  await Order.findById(req.params.id);
        if(order) {
             await order.deleteOne();
             res.json({ message: "Order deleted successfully"});
        } else {
            res.status(404).json({ msg: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
})



module.exports = router;