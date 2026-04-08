const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  stock: { type: Number, default: 0 },
  price: Number,
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    shortDescription: String,

    brand: String,
    category: String,

    price: { type: Number, required: true },
    discountPrice: Number,
    currency: { type: String, default: "INR" },

    variants: [variantSchema],

    images: [
      {
        url: String,
      },
    ],

    tags: [String],

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
