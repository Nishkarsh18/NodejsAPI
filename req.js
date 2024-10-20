// req object , param and query
const express = require("express");
const app = express();
app.use(express.json()); // middleware to get data from a json from a post request
//for query
app.get("/", (req, res, next) => {
  console.log(req.method);
  console.log(req.query);
  res.status(200).json({
    message: "hello world",
  });
});

//params
app.get("/:name", (req, res, next) => {
  console.log(req.method);
  console.log(req.params.name);
  res.status(200).json({
    message: "hello world",
  });
});


// post to get body from the user got parsed from middleware
app.post("/", (req, res, next) => {
  console.log("Got a post Request");
  console.log(req.body);
  res.send("Recieved");
});

app.listen(3000, () => {
  console.log("Server is started");
});
