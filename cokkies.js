//jwt token should be saved in httpOnly cookie

const sendToken = async (user, statusCode, res, next) => {
  // create token
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
  });
};

module.exports = sendToken;
