const jwt = require("jsonwebtoken");
// const { promisify } = require('util'); // promisify builtin node m used to return promise from opp
// const crypto = require('crypto');

const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
// const AppError = require('../utils/appError.js');
// const sendEmail = require('../utils/email.js');

//   console.log("✅ User created:", user);
//   console.error("❌ Error creating user:", err.message);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // 365d
  });
};

// send response with cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // send jwt token by cookie
  cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, // https only
    httpOnly: true, // cookie can not be access or modifed by any way in browser
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    createdAt: req.body.createdAt || undefined,
    role: req.body.role || undefined,
  });

  // createSendToken(newUser, 201, res);

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});
