const User = require("../models/userModel.js");

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

// async function createUser() {
//   try {
//     const user = await User.create({
//       name: "ahmed",
//       password: "12345678",
//       passwordConfirm: "12345678",
//     });

//     console.log("✅ User created:", user);
//   } catch (err) {
//     console.error("❌ Error creating user:", err.message);
//   }
// }

// createUser();
