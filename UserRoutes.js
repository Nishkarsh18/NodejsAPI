const express = require("express");
const router = express.Router();
const { getuser } = require("./userController");
const { isAuthenticatedUser } = require("./authmiddleware");
router.route("/me").get(function (req, res, next) {
  isAuthenticatedUser(req, res, next);
}, getuser);

module.exports = router;
