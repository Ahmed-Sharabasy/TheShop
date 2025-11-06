const User = require("../models/userModel.js");
const AppError = require("../utils/AppError");
const Purchase = require("../models/purchaseModel.js");
const Product = require("../models/productModel.js");

exports.createPurchase = async (req, res, next) => {
  const { supplier, products, InvoiceNumber } = req.body;

  const user = await User.findById(supplier);
  console.log(user);
  if (user.role != "supplier")
    return next(new AppError("must be a supplier", 401));

  console.log(products);

  // حساب المجموع الكلي
  const totalAmount = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  console.log(totalAmount);

  // إنشاء فاتورة الشراء
  const newPurchase = await Purchase.create({
    supplier,
    InvoiceNumber,
    products,
    totalAmount,
  });

  let updatedProduct = {
    products: [],
  };

  for (const item of products) {
    const result = await Product.findByIdAndUpdate(
      item.product,
      {
        $set: { price: item.price },
        $inc: { quantity: item.quantity },
      },
      { new: true, runValidators: true }
    );
    updatedProduct.products.push(result);
  }

  console.log(updatedProduct.products);

  res.status(200).json({
    data: { newPurchase },
    status: "success",
    message: "Purchase created and product quantities updated successfully",
  });
};
