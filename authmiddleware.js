const jwt = require("jsonwebtoken");
const User = require("./users");
const catchAsyncErrors = require("./catchasyncerror");
const ErrorHandler = require("./errorHandler");

//check if user is authenticated or not

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }
  const decoded = jwt.verify(token, "304959DLKFJ98435093JDFKG035K");

  req.user = await User.findById(decoded.id).select("+role");
  //console.log("hello");
  //console.log(req.user);
  next();
});

exports.authorizeRoles = (role, req, res, next) => {
  //console.log("hello2");

  if (req.user.role != role) {
    return next(new ErrorHandler("role is not present", 401));
  }
  next();
};
