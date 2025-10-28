const Product = require("../models/productModel.js");
const Sale = require("../models/saleModel.js");
const AppError = require("../utils/AppError.js");

const CASH_CUSTOMER_ID = process.env.CASH_CUSTOMER_ID;

exports.saleProduct = async (req, res, next) => {
  const customer = req.body.customer || CASH_CUSTOMER_ID;
  const productId = req.body.product;

  const price = Number(req.body.price) || 0;
  const saleQuantity = Number(req.body.saleQuantity) || 1;
  const paidAmount = Number(req.body.paidAmount) || price * saleQuantity;

  console.log(product);

  // 1️⃣ ابحث عن المنتج
  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));

  // 2️⃣ تحقق من الكمية
  if (product.quantity < 1 || product.quantity < saleQuantity) {
    return next(new AppError("Not enough quantity available", 400));
  }

  // 3️⃣ احسب السعر الكلي
  const totalPrice = product.price * saleQuantity;

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
