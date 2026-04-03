const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+\@.+\..+/, "Please fill a valid email address"],
        },
        password: {
            type: String,
            required: function () { return !this.googleId; },
            minLength: 6,
        },
        googleId: String,
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        resetPasswordOTP: String,
        resetPasswordExpires: Date,
        addresses: [
            {
                firstName: String,
                lastName: String,
                address: String,
                city: String,
                state: String,
                pincode: String,
                phone: String,
                isDefault: { type: Boolean, default: false }
            }
        ],
    },
    { timestamps: true }
);

//Password Hash middleware
userSchema.pre('save', async function (next) {
    if (!this.password || !this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Match User entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

