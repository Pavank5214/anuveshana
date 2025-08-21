const express = require('express');
const Subscriber = require('../models/Subscriber');

const router = express.Router();

// @route POST /api/subscribe
// @desc Subscribe to newsletter
// @access Public
router.post('/subscribe', async (req, res) => {
    const {email } = req.body;
    if(!email){
        return res.status(400).json({msg: 'Please enter your email address.'});
    }
    try {
        // Check if email is already subscribed
        const subscriber = await Subscriber.findOne({email});
        if(subscriber){
            return res.status(400).json({msg: 'Email already subscribed.'});
        }

        // Create new subscriber
        const newSubscriber = new Subscriber({email});
        await newSubscriber.save();
        res.status(201).json({msg: 'You have been subscribed to our newsletter.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Error subscribing to newsletter.'});
    }
});

module.exports = router;