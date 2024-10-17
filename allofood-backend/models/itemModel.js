const mongoose = require('mongoose');
const Category = require('./categoryModel');
const Restaurant = require('./restaurantModel');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        validate: {
            validator: async function (categoryId) {
              const category = await Category.findById(categoryId);
              return category != null;
            },
            message: "Category does not exist sadly",
        },
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        validate: {
            validator: async function (restaurantId) {
              const restaurant = await Restaurant.findById(restaurantId);
              return restaurant != null;
            },
            message: "Restaurant does not exist sadly",
        },
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;