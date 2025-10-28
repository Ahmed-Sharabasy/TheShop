const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter The name Please!"],
      trim: true,
    },
    idNumber: Number,
    category: {
      type: String,
      required: [true, "Enter The Product Category!"],
      trim: true,
    },
    discription: String,
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
