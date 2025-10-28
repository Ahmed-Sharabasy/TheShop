const Product = require("../models/productModel.js");
const AppError = require("../utils/AppError.js");

// exports.getProudctByType = async (req, res, next) => {
//   const query = req.query;

//   const Products = await Product.find(query);
//   // modify it
//   if (!Products) {
//     console.log("no");
//     next(new AppError("no type called like this ", 404));
//   }

//   res.status(201).json({
//     status: "success",
//     data: { Products },
//   });
// };

exports.getProductByID = async (req, res, next) => {
  console.log(req.params);
  const id = req.params.id;
  const Products = await Product.findById(id);

  if (!Products) {
    return next(
      new AppError("wrong Id Or Id Not Founded In your Database", 404)
    );
  }
  res.status(201).json({
    status: "success",
    data: { Products },
  });
};

// Add serach to api features and update this func to add search
exports.getAllProducts = async (req, res) => {
  // { <field>: { $regex: /pattern/, $options: '<options>' } }
  const Products = await Product.find({
    name: { $regex: req.query.name, $options: "i" }, // i case insensitive
  });

  res.status(201).json({
    status: "success",
    data: { Products },
  });
};

// craete
exports.createProduct = async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: { newProduct },
  });
};

// delete
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
};

// update
exports.updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: { updatedProduct },
  });
};
