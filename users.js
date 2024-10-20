const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "employeer"],
      message: "Please select right role",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [8, "Must be more than 8"],
    select: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
},{
      toJson = {virtuals : true},
      toObject = {virtuals:true}
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// return jwt

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, "304959DLKFJ98435093JDFKG035K", {
    expiresIn: "7d",
  });
};

//compare passwords

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate password reset token

userSchema.methods.getResetPasswordToken = function () {
  //generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //has token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; //30 min
};

userSchema.virtual("jobPublished", {
  ref: "Job",
  localField: "_id",
  foriegnerField: "user",
  justOne: false,
});

module.exports = mongoose.model("User", userSchema);
