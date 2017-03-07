var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  userId: {type: Number},
  firstName: {type: String},
  lastName: {type: String},
  gender: {type: String}
});

module.exports = mongoose.model("User", UserSchema);