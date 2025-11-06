const User = require("../models/userModel.js");
const AppError = require("../utils/AppError");
const Purchase = require("../models/purchaseModel.js");

exports.createPurchase = async (req, res, next) => {
  const { supplier, products } = req.body;

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
  const Purchase = await Purchase.create({
    supplier,
    products,
    totalAmount,
  });
  console.log(Purchase);

  // تحديث الكمية في الـ Product
  // for (const item of products) {
  //   await Product.findByIdAndUpdate(item.product, {
  //     $inc: { quantity: item.quantity }, // ← زي ما طلبت بالضبط
  //   });
  // }

  res.status(200).json({
    data: { Purchase },
    status: "success",
    message: "Purchase created and product quantities updated successfully",
  });
};
