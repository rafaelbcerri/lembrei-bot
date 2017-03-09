var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: {type: Number},
  firstName: {type: String},
  lastName: {type: String},
  gender: {type: String}
});

module.exports = mongoose.model("User", UserSchema);