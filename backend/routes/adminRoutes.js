const express = require('express');
const User = require('../models/User');
const {protect, admin} = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @acces Private/Admin
router.get("/", protect , admin , async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching users" });
    }
});

// @route POST //api/admin/users
// @desc Create a new user (Admin only)
// @acces Private/Admin
router.post("/" , protect , admin , async (req, res) => {
    const {name , email , password , role} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg: "User already exists" });
        } 
            user = new User({
                name ,
                email ,
                password , 
                role : role || "customer"
                });
        await user.save();
        res.status(201).json({message : "User created successfully ",user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error creating user" });
    }
});

// @route PUT //api/admin/users/:id
// @desc Update a user (Admin only)
// @acces Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
            }
            user.name = name || user.name;
            user.email = email || user.email;
            if(password){
                user.password = await bcrypt.hash(password, 10);
            }
            
            user.role = role || user.role ;
            await user.save();
            res.json({ message: "User updated successfully", user });
     } catch (error) {
         console.error(error);
        res.status(500).json({ msg: "Error updating user" });
     }
});

// @route DELETE //api/admin/users/:id
// @desc Delete a user (Admin only)
// @acces Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const user =  await User.findById(req.params.id);
        if(user) {
             await user.deleteOne();
             res.json({ message: "User deleted successfully"});
        } else {
            res.status(404).json({ msg: "User not found" });
        }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error deleting user" });
    }
});

module.exports = router;