const Product = require("../models/productModel.js");
const AppError = require("../utils/AppError.js");

exports.getProudctByType = async (req, res, next) => {
  const query = req.query;

  const Products = await Product.find(query);
  // modify it
  if (!Products) {
    console.log("no");
    next(new AppError("no type called like this ", 404));
  }

  res.status(201).json({
    status: "success",
    data: { Products },
  });
};

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
  // const Products = await Product.find({ name: /some/i });
  const searchQuery = req.query.search;
  console.log(searchQuery);

  // new RegExp(..., "i")
  // معناها تجاهل الفرق بين الحروف الكبيرة والصغيرة (case-insensitive)
  const filter = searchQuery ? { name: new RegExp(searchQuery, "i") } : {};

  const Products = await Product.find(filter);

  res.status(201).json({
    status: "success",
    data: { Products },
  });
};
exports.createProduct = async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: { newProduct },
  });
};
