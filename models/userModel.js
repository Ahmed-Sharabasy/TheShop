const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: [true, "you must enter your name"] },
    password: { type: String, required: true, minlength: 8, select: false },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwordConfirm are not the same as password ",
      },
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "please enter a valid eamil "],
    },

    role: { type: String, enum: ["admin", "user"], default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 12); // Hash and save password
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPasswordsAreTheSame = async function (
  passwod,
  userPasswod
) {
  return await bcryptjs.compare(passwod, userPasswod);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.createdAt) {
    let passwordChangedDate = parseInt(this.createdAt.getTime() / 1000);
    return JWTTimestamp < passwordChangedDate;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
