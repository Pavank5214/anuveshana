const express = require("express");
const Checkout = require("../models/Checkout")
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access private
router.post("/", protect, async (req, res) => {
    const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;

    if(!checkoutItems || checkoutItems.length === 0){
        return res.status(400).json({msg: "No items in Chekout" });
    }
        try {
            // Crate new checkout session
            const newCheckout = await Checkout.create({
                user : req.user._id,
                checkoutItems: checkoutItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size, 
                    custName : item.custName,   
                    textColor: item.textColor,
                    baseColor : item.baseColor  
                  })),
                shippingAddress,
                paymentMethod,
                totalPrice,
                paymentStatus : "Pending",
                isPaid : false,
            });
            res.status(201).json(newCheckout);
        } catch (error) {
            console.error("Error Creating checkout session:",error);
            res.status(500).json({message: "Server Error"});
        }
});

// @route PUT /api/checkout/:id/pay
// @desc Update the payment status of a checkout session
// @access private
router.put("/:id/pay", protect, async(req,res)=>{
    const {paymentStatus , paymentDetails} = req.body;
    
    try {
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout) return res.status(404).json({msg: "Checkout not found"});
        if (paymentStatus && paymentStatus.toLowerCase() === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = "Paid"; // normalize
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();
            return res.status(200).json(checkout);
        } else {
            return res.status(400).json({ msg: "Invalid payment status" });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Server Error"});
    }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access private
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) return res.status(404).json({ message: "Checkout not found"});
        if (checkout.isPaid && !checkout.isFinalized) {
            // create final order based on the checkout details
            const finalOrder = await Order.create({
                user : checkout.user,
                orderItems: checkout.checkoutItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,    
                    custName : item.custName,   
                    textColor: item.textColor,
                    baseColor : item.baseColor   
                  })),
                shippingAddress : checkout.shippingAddress,
                paymentMethod : checkout.paymentMethod,
                totalPrice : checkout.totalPrice,
                isPaid : true,
                paidAt : checkout.paidAt,
                isDelivered : false,
                paymentStatus : "Paid",
                paymentDetails : checkout.paymentDetails,
            });

            // Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            // Delete the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json(finalOrder);
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" });
        } else {
            res.status(400).json ({ message: "Checkout not paid" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Server Error"});
    }
});


module.exports = router;