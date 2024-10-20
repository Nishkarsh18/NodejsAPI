//routes hande for authorisation
const express = require("express");
const router = express.Router();
const {
  regiternewuser,
  loginuser,
  forgotPassword,
  resetPassword,
  logout,
} = require("./authController");
router.route("/register").post(regiternewuser);
router.route("/login").post(loginuser);
router.route("/forgot").post(forgotPassword);
router.route("/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
module.exports = router;
