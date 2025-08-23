const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter The name Please!"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Enter The Product Category!"],
      trim: true,
    },
    discription: {
      type: String,
      trim: true,
      minlength: [6, "Too short"],
    },
    quantity: {
      type: Number,
      required: [true, "Enter The Product Quantity!"],
      trim: true,
    },
    price: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
