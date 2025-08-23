const express = require("express");
const userController = require("../controllers/userController.js");

router = express.Router();

router.route("/").get(userController.getAllUser);
module.exports = router;
