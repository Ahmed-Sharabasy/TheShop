const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController.js");

router.route("/").post(purchaseController.createPurchase);
// .get(purchaseController.getAllPurchases);

module.exports = router;
