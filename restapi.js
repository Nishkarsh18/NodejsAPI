const http = require("http");
const { json } = require("stream/consumers");
const express = require("express");
const app = express();
const server = http.createServer((req, res) => {
  const content = {
    message: "hello world",
  };
  const jsononj = JSON.stringify(content);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Language", "en-US");
  res.setHeader("Date", new Date(Date.now()));
  res.end(jsononj);
});
server.listen(3000, () => {
  console.log("Connection is setup");
});

// http headers
// send essential headers
