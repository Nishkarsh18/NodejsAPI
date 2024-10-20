const nodeGeocoder = require("node-geocoder");
const options = {
  provider: "opencage",
  httpAdapter: "https",
  apiKey: "f4eac78c85d6491383833ecf675ec4d7",
  formatter: null,
};
const geocoder = nodeGeocoder(options);
module.exports = geocoder;
