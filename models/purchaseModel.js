const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    InvoiceNumber: {
      type: Number,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } //for create createdAt,updatedAt and update the date automaticlly in updatedAt prb
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
