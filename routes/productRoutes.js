const express = require("express");
const productController = require("../controllers/productController.js");

router = express.Router();

router.route("/searchByCategory").get(productController.getProudctByType);
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router.route("/:id").get(productController.getProductByID);

module.exports = router;
