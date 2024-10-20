// building restful apis using nodejs
// employee database and documentation using apis
// async and event driven
// json bases api
// cpu intensive - not advisable
// node js depends on v8 engine
// node js is single threaded
// node js is event driven
// callback helps us from blocking of the code
// async jobs run in background and call callback function once completed
// in this way it helps nodejs to be non blocking
// callback ex - reading in file , updates

let lang = "js";
console.log(lang);

const { error } = require("console");
// callback function

let fs = require("fs");

//reading data syncronously
let data = fs.readFileSync("a.txt", "utf-8");
console.log(data);

//reading data asynchronously

fs.readFile("a.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
console.log("Async");

// event loops
// only 1 thread is created in node whethere 1 user or 1000
// event loop is a loop that checks for the event and executes it
// thread pool runs the heavy task - generally 4 tasks and process the blocking task in background without impacting the main event loop

// event driven architechture
// event emitter - emits the event
// event listener  - listens to the event
// callback function called for the event listner

// event driven code

let events = require("events");
let eventEmitter = new events.EventEmitter();

eventEmitter.on("connection", () => {
  // event listner
  console.log("connection success"); // callback or eventhandler
});
eventEmitter.emit("connection"); // event emitter

// APIs and Restful APIs

// API allows 2 application to talk to each other
// example getting weather on phone

// Restful API
// client and server are different
// stateless api
// server don't store any state it should be stored in the client side
// send data in json mostly

//why we need an api
// is flexible to be used by different application
// db ------> API ------> Application
