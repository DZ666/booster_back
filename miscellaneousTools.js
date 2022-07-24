const package = require("./package.json");

function getAllServicesNames() {
  return package.config.services.split(" ");
}

module.exports = {
  getAllServicesNames
};