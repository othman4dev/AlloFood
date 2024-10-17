const mongoose = require("mongoose");
const User = require("./UserModel");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (userId) {
          const user = await User.findById(userId);
          return user != null;
        },
        message: "User does not exist sadly",
      },
    },
    images: {
      banner: {
        type: String,
        required: true,
      },
      profileImage: {
        type: String,
        required: true,
      },
      slides: [
        {
          type: String,
          required: true,
        },
      ],
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "close"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
