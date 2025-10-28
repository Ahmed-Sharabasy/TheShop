const mongoose = require("mongoose");
const AppError = require("../utils/AppError.js");
const Product = require("./productModel.js");
const User = require("./userModel.js");

const saleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: Number,
    saleQuantity: {
      type: Number,
      default: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual Middleware
// saleSchema.virtual("totalPrice").get(function () {
//   return this.saleQuantity * this.price;
// });

// function to check if total price is bigger than product price or not
saleSchema.methods.checkIFPriceISMatch = function () {
  if (this.product.price > this.price)
    return new AppError("product price is bigger than your price", 401);
  return true;
};

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
