const User = require("./users");
const catchAsyncErrors = require("./catchasyncerror");
const ErrorHandler = require("./errorHandler");
const { userInfo } = require("os");
const sendToken = require("./to");
const fs = require("fs");
//get current user  -- /api/v1/me

exports.getMe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "jobsPublished",
    select: "title postingDate",
    // virtual name
  });
  if (!user) {
    return next(new ErrorHandler("Please Login", 404));
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

//update user password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const ismatched = user.comparePassword(req.body.currentPassword);
  if (!ismatched) {
    return next(new ErrorHandler("No password match", 401));
  }
  user.password = req.body.newPassword;
  user.save();
  //sendToken(user,200,res);
});

//update data
exports.updataUserData = catchAsyncErrors(async (req, res, next) => {
  const newdata = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newdata, {
    new: true,
    runvalidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

//delete data
exports.deleteuser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

exports.showAllAppliedJobs = catchAsyncErrors(async (req, res, next) => {
  const allappliedJobs = await Job.find({ "applicantApplied.id": user }).select(
    "+applicantApplied",
  );
  res.status(200).json({
    success: true,
    data: allappliedJobs,
  });
});

//show all jobs posted by user

exports.showAllPostedJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = Job.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    data: jobs,
  });
});

async function deleteuserData(user, role) {
  if (role === "employeer") {
    //delete user
    //delete jobs created by user
    await Job.deleteMany({ user: user });
  } else if (role === "user") {
    const appliedJobs = await Job.find({ "applicantApplied.id": user }).select(
      "+applicantApplied",
    );
    for (let i = 0; i < appliedJobs.length; i++) {
      let obj = appliedJobs[i].applicantsApplied.find((o) => o.id === user);
      let filepath = `${__dirname}/public/uploads/${obj.resume}`.replace(
        "\\controllers",
        "",
      );
      fs.unlink(filepath, (err) => {
        if (err) {
          return console.log(err);
        }
      });
      appliedJobs[i].applicantsApplied.splice(
        appliedJobs[i].applicantsApplied.indexOf(obj.id),
      );
      appliedJobs[i].save();
    }
  }
}
