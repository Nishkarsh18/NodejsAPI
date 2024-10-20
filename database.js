const mongoose = require("mongoose");
const url =
  "mongodb+srv://nishkarshbisht18:nishkarshbisht18@cluster.xwsku.mongodb.net/";
const connectectDatabase = () => {
  mongoose.connect(url).then((con) => {
    console.log("connected");
  });
};

module.exports = connectectDatabase;
