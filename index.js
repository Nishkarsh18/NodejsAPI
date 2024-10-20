// building restful api
// jobeee-api

//all requires
const express = require("express");
const app = express();
const jobs = require("./jobs");
const connectdb = require("./database");
const mongoose = require("mongoose");
const errormiddleware = require("./error");
const errorHandler = require("./errorHandler");
const user = require("./auth");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server");
  server.close(() => {
    process.exit(1);
  });
});

connectdb();
app.use(helmet()); //securing header

//const dotenv = require('dotnev');
//setting up config file
//dotenv.config({path:'./config.env''});
// importing routes

const middleware = (req, res, next) => {
  console.log("middleware");
  req.user = "Nishkarsh";
  next();
};
app.use(middleware);
app.use(express.json()); // middleware to get all json data from post request
app.use(cookieParser());
app.use(fileUpload());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);
app.use(mongosanitize());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use("/api/v1", jobs);
app.use("/api/v1", user);
app.all("*", (req, res, next) => {
  next(new errorHandler("Route does not exist", 404));
});
app.use(errormiddleware);

// const port = process.env.PORT;

const server = app.listen(3000, () => {
  console.log("Server started");
});

// handling unhandled promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server");
  server.close(() => {
    process.exit(1);
  });
});
