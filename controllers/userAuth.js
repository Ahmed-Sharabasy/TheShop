// const jwt = require("jsonwebtoken");
const { promisify } = require("util"); // promisify builtin node m used to return promise from opp
// // const crypto = require('crypto');

// const User = require("../models/userModel.js");
// const catchAsync = require("../utils/catchAsync.js");
// const AppError = require("../utils/AppError.js");
// // const sendEmail = require('../utils/email.js');

// //   console.log("✅ User created:", user);
// //   console.error("❌ Error creating user:", err.message);

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN, // 365d
//   });
// };

// // send response with cookie
// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user.id);

//   // send jwt token by cookie
//   cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     // secure: true, // https only
//     httpOnly: true, // cookie can not be access or modifed by any way in browser
//   };

//   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

//   res.cookie("jwt", token, cookieOptions);

//   user.password = undefined;

//   res.status(statusCode).json({
//     status: "success",
//     token,
//     data: {
//       user,
//     },
//   });
// };

// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm,
//     createdAt: req.body.createdAt || undefined,
//     role: req.body.role || undefined,
//   });

//   // createSendToken(newUser, 201, res);

//   const token = signToken(newUser._id);
//   res.status(201).json({
//     status: "success",
//     token,
//     data: {
//       newUser,
//     },
//   });
// });

// exports.login = catchAsync(async (req, res, next) => {
//   //1) check if there are email , password in req.body
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return next(new AppError("there are no passwod or email ", 404));
//   }
//   //2) check if user data is valid
//   const user = await User.findOne({ email }).select("+password");
//   if (!user || !(await checkPasswordsAreTheSame(password, user.password))) {
//     return next(new AppError("invalid user or password are not correct", 404));
//   }
//   console.log(user);
//   //3) sign in and send token
//   // createSendToken(user, 200, res);
//   const token = signToken(user._id);
//   res.status(201).json({
//     status: "success",
//     token,
//     data: {
//       newUuserser,
//     },
//   });
// });

// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");

// sign jwt
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // e.g. '90d' or number
  });

// send response with cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id || user.id);

  // cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        // ensure env var is a number (days). fallback to 90 days if not present
        (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // not accessible by JS
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // remove password from output
  if (user.password) user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  // pick only fields you want users to set
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    createdAt: req.body.createdAt || undefined,
    role: req.body.role || undefined,
  });

  // set cookie + send token & user (without password)
  createSendToken(newUser, 201, res);
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check email & password provided
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // 2) find user and include password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3) verify password
  // prettier-ignore
  if (!user || !(await user.checkPasswordsAreTheSame(password, user.password))) {
    return next(new AppError("invalid user or password are not correct", 404));
  }
  // 4) send token
  createSendToken(user, 200, res);
});

// protect the route allow login users only
exports.protected = catchAsync(async (req, res, next) => {
  // get jwt from req.headers.Authorization
  let token;
  // prettier-ignore
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(new AppError("you Are not logged in please Log In!", 401));
  // decode and get the user
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("no user found in db", 401));

  //4) check if user changed his pass after jwt token is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user changed his password , enter new passwod", 401)
    );
  }
  // Grant Access To the Protected Route
  // save the current User to req.user for later use
  req.user = currentUser;
  next();
});

// check Who Have Permisions to do this job
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles:["user", "guide", "leads-guide", "admin"] => role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError("user not Authorized to do this Action", 403));
    }
    next();
  };
};
