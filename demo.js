const mongoose = require("mongoose");
url =
  "mongodb+srv://nishkarshbisht18:nishkarshbisht18@cluster.xwsku.mongodb.net/";
mongoose.connect(url);
const schema = new mongoose.Schema({
  name: String,
});
mongoose.model("User", schema);
