const express = require("express");
const saleController = require("../controllers/saleController.js");

const router = express.Router();

router.route("/").post(saleController.saleProduct);

module.exports = router;
