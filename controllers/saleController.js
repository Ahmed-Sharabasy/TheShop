const Product = require("../models/productModel.js");
const Sale = require("../models/saleModel.js");
const AppError = require("../utils/AppError.js");

exports.saleProduct = async (req, res, next) => {
  const customer = req.body.customer || process.env.CASH_CUSTOMER_ID;
  const productId = req.body.product;

  const price = Number(req.body.price) || 0;
  const saleQuantity = Number(req.body.saleQuantity) || 1;
  const paidAmount = price * saleQuantity;
  console.log("here 0");
  // 1️⃣ ابحث عن المنتج
  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));

  console.log("here 1");
  // 2️⃣ تحقق من الكمية
  if (product.quantity < 1 || product.quantity < saleQuantity) {
    console.log("here");
    return next(new AppError("Not enough quantity available", 400));
  }

  // 3️⃣ احسب السعر الكلي
  const totalPrice = product.price * saleQuantity;

  console.log(totalPrice, paidAmount);
  // 4️⃣ تحقق من الدفع
  if (paidAmount < totalPrice) {
    return next(
      new AppError(
        `Insufficient amount: required ${totalPrice}, but got ${paidAmount}`,
        400
      )
    );
  }

  // 5️⃣ أنشئ البيع
  const sale = await Sale.create({
    customer,
    product: productId,
    price,
    saleQuantity,
  });

  // 6️⃣ خصم الكمية من المنتج
  product.quantity -= saleQuantity ?? 1;
  await product.save();

  // 7️⃣ الرد النهائي
  res.status(201).json({
    status: "success",
    data: { sale },
  });
};
