const catchasyncerror = require("./catchasyncerror");
const ErrorHandler = require("./errorHandler");
const userSchema = require("./users");
const mongoose = require("mongoose");
const sendToken = require("./cokkies");
const sendMail = require("./sendEmail");
const crypyto = require("crypto");

exports.regiternewuser = catchasyncerror(async (req, res, next) => {
  const { name, email, password, role } = req.body; //bcs password needs to be hashed
  const newuser = await userSchema.create({
    name,
    email,
    password,
    role,
  });
  //created jwt token
  sendToken(user, 200, res);
});

exports.loginuser = catchasyncerror(async (req, res, next) => {
  const username = req.body.email;
  const password = req.body.password;
  const user = await userSchema
    .findOne({ email: username })
    .select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  //check if password is correct
  const compareresult = await user.comparePassword(password);
  console.log(compareresult);
  if (compareresult) {
    sendToken(user, 200, res);
  } else {
    return next(new ErrorHandler("invalid pass", 401));
  }
  // create jsonwebten
});

//handling users roles

//forgot password
exports.forgotPassword = catchasyncerror(async (req, res, next) => {
  const user = await userSchema.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  //create reset url
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/${resetToken}`;
  message = resetUrl;
  await sendMail({
    email: user.email,
    subject: "Password Reset Token",
    message: message,
  });
  res.status(200).json({
    success: true,
  });
});

// reset password
exports.resetPassword = catchasyncerror(async (req, res, next) => {
  //hash token
  let resetpasswordtoken = crypyto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  resetpasswordtoken = req.params.token;
  const user = await userSchema.findOne({
    resetPasswordToken: resetpasswordtoken,
  });
  if (!user) {
    return next(new ErrorHandler("Invalid token", 400));
  }

  //setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//logout user

exports.logout = catchasyncerror(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out",
  });
});
