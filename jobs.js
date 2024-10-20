// files to declare all routes
const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("./authmiddleware");

//importing controller

const {
  getjobs,
  newJob,
  getjobsinradius,
  updateJob,
  deleteJob,
  getJobById,
  getStats,
} = require("./controller");

router.route("/jobs").get(getjobs);
router.route("/job/new").post(
  function (req, res, next) {
    isAuthenticatedUser(req, res, next);
  },
  function (req, res, next) {
    authorizeRoles("user", req, res, next);
  },
  newJob,
);
router.route("/jobs/:zipcode/:distance").get(getjobsinradius);
router.route("/job/:id").put(updateJob);
router.route("/job/:id").delete(deleteJob);
router.route("/job/:id/:slug").get(getJobById);
router.route("/stats/:topic").get(getStats);
module.exports = router;

//
