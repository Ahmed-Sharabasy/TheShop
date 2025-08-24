const express = require("express");
const userController = require("../controllers/userController.js");
const userAuth = require("../controllers/userAuth.js");

const router = express.Router();

router.route("/").get(userController.getAllUser);

router.route("/signup").post(userAuth.signup);
router.route("/login").post(userAuth.login);

// export one thing only
module.exports = router;
