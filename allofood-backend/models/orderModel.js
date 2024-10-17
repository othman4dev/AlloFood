const mongoose = require('mongoose');
const User = require('./userModel');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (userId) {
                const user = await User.findById(userId);
                return user != null;
            },
            message: "User does not exist sadly",
        },
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

orderSchema.pre('save', async function(next) {
    try {
        this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        next();
    } catch (error) {
        next(error);
    }
});